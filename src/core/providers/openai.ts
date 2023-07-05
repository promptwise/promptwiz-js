import {
  Tiktoken,
  TiktokenModel,
  encodingForModel,
  getEncodingNameForModel,
} from "js-tiktoken";
import { ChatMessage, PromptProvider, PromptwizOutput } from "../types";
import { template_regex } from "../utils/parseTemplateStrings";
import { convertTextToChatMessages } from "../utils";
import { AuthorizationError, RateLimitError, ServerError } from "../errors";

export const runPrompt: PromptProvider = (
  { model, access_token, parameters },
  prompt,
  signal
): Promise<PromptwizOutput[]> => {
  if (!access_token)
    throw new AuthorizationError(
      "Missing access_token required to use OpenAI api!"
    );

  const isChatPrompt = Array.isArray(prompt);
  const isChatModel = model.includes("gpt-3.5") || model.includes("gpt-4");

  const requestBody: Record<string, any> = {
    model,
    ...parameters,
    // stream,
  };

  if (isChatModel) {
    requestBody.messages = isChatPrompt ? prompt : convertTextToChatMessages;
  } else {
    requestBody.prompt = prompt;
  }
  const body = JSON.stringify(requestBody);
  return fetch(
    isChatModel
      ? "https://api.openai.com/v1/chat/completions"
      : "https://api.openai.com/v1/completions",
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${access_token}`,
      },
      signal,
      body,
    }
  )
    .then((resp) => assessOpenAIResponse(resp))
    .then(({ choices, usage }) => {
      if (!choices.length) return []; // TODO: log here? Is this condition even really possible?
      // If only a single output then we can just piggy-back on OpenAI's token count
      if (choices.length === 1) {
        return [
          {
            content: choices[0].message.content,
            tokens: usage.completion_tokens,
            truncated: choices[0].finish_reason === "length",
          },
        ];
      }

      const tokenizer = getTokenizer(model);

      return choices.map(
        isChatModel
          ? // @ts-expect-error - later
            ({ message, finish_reason }) => ({
              content: message.content,
              tokens: tokenizer.count(message.content),
              truncated: finish_reason === "length",
            })
          : // @ts-expect-error - later
            ({ text, finish_reason }) => ({
              content: text,
              tokens: tokenizer.count(text),
              truncated: finish_reason === "length",
            })
      );
    });

  // if (stream) {
  //   // Create a TransformStream to pipe the response through to the client
  //   const transformStream = new TransformStream();
  //   resp.body!.pipeTo(transformStream.writable);
  //   return new Response(transformStream.readable, {
  //     headers: { "content-type": "application/json" },
  //   });
  // }
};

async function assessOpenAIResponse(response: Response) {
  const responseBody = await response.json();
  if (!response.ok) {
    const status = response.status;
    const message =
      responseBody.error?.message ||
      responseBody.error?.response ||
      "Unknown API response";
    switch (status) {
      case 401:
        throw new AuthorizationError(message);
      case 429:
        throw new RateLimitError(message);
      case 500:
        throw new ServerError(message);
      default:
        throw new Error(message);
    }
  }
  return responseBody;
}

let _encoder_cache: null | { encoder: Tiktoken; encoding: string } = null;

export function getTokenizer(model: string) {
  // try to pull the encoder from cache if possible so we don't have to reinitialize it every call
  const encoding: string = getEncodingNameForModel(model as TiktokenModel);
  const encoder =
    _encoder_cache?.encoding === encoding
      ? _encoder_cache.encoder
      : encodingForModel(model as TiktokenModel);

  const decode_array = (tokens: number[]): string[] => {
    const res: Uint8Array[] = [];
    for (let i = 0; i < tokens.length; ++i) {
      const token = tokens[i];
      const bytes =
        // @ts-expect-error - these do in fact exist on the encoder
        encoder.textMap.get(token) ?? encoder.inverseSpecialTokens[token];

      if (bytes != null) {
        res.push(bytes);
      }
    }
    // @ts-expect-error - this do in fact exist on the encoder
    return res.map((bytes) => encoder.textDecoder.decode(bytes));
  };

  return {
    encode(text: string, preserve_templates = false): number[] {
      const tokens = Array.from(
        encoder.encode(
          preserve_templates ? text : text.replaceAll(template_regex, "")
        )
      );
      return [...tokens] as number[];
    },
    decode: encoder.decode,
    decodeTokens(tokens: number[]): string[] {
      return decode_array(tokens);
    },

    decodeToken(tokens: number): string {
      return decode_array([tokens])[0];
    },
    count(
      value: string | ChatMessage | Array<ChatMessage>,
      preserve_templates = false
    ): number {
      if (typeof value === "string") return this.encode(value).length;
      if (!Array.isArray(value))
        return this.encode(value.content, preserve_templates).length + 5;
      // tokenize each message individually and add them up
      return value.reduce(
        (sum, msg) =>
          sum + this.encode(msg.content, preserve_templates).length + 5, // adding 4 to account for the delimiter and formating tokens inserted by OpenAI for every message
        3 // starting at 3 to account for the trailing assistant message prompt that OpenAI appends to chat messages
      );
    },
  };
}

export function maxTokensForModel(model: string): number {
  const model_windows = {
    "text-davinci-003": 4097,
    "text-davinci-002": 4097,
    "text-davinci-001": 2049,
    "text-curie-001": 2049,
    "text-babbage-001": 2049,
    "text-ada-001": 2049,
    davinci: 2049,
    curie: 2049,
    babbage: 2049,
    ada: 2049,
    "code-davinci-002": 8001,
    "code-davinci-001": 8001,
    "code-cushman-002": 2048,
    "code-cushman-001": 2048,
    "davinci-codex": 2049,
    "cushman-codex": 2049,
    "text-davinci-edit-001": 2049,
    "code-davinci-edit-001": 2049,
    "text-embedding-ada-002": 2049,
    "text-similarity-davinci-001": 2049,
    "text-similarity-curie-001": 2049,
    "text-similarity-babbage-001": 2049,
    "text-similarity-ada-001": 2049,
    "text-search-davinci-doc-001": 2049,
    "text-search-curie-doc-001": 2049,
    "text-search-babbage-doc-001": 2049,
    "text-search-ada-doc-001": 2049,
    "code-search-babbage-code-001": 2049,
    "code-search-ada-code-001": 2049,
    "gpt-4": 8192,
    "gpt-4-0314": 8192,
    "gpt-4-0613": 8192,
    "gpt-4-32k": 32768,
    "gpt-4-32k-0314": 32768,
    "gpt-4-32k-0613": 32768,
    "gpt-3.5-turbo": 4096,
    "gpt-3.5-turbo-0301": 4096,
    "gpt-3.5-turbo-16k": 16384,
    "gpt-3.5-turbo-16k-0613": 16384,
  };
  return model_windows[model as keyof typeof model_windows] || 0;
}
