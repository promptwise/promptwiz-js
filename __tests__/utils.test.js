const {
  convertChatMessagesToText,
  convertTextToChatMessages,
  hydratePromptInputs,
  parseTemplateStrings,
} = require("../build/cjs/core/utils");

describe("utils", () => {
  test("convertChatMessagesToText", () => {
    expect(convertChatMessagesToText([])).toBe("");
    expect(
      convertChatMessagesToText([
        { role: "system", content: "You are a friendly robot named Tim." },
      ])
    ).toBe("System: You are a friendly robot named Tim.");
    expect(
      convertChatMessagesToText([
        { role: "system", content: "You are a friendly robot\n\nnamed Tim." },
      ])
    ).toBe("System: You are a friendly robot\n\nnamed Tim.");
    expect(
      convertChatMessagesToText([
        { role: "system", content: "You are a friendly robot named Tim." },
        { role: "user", content: "Hi there!" },
      ])
    ).toBe("System: You are a friendly robot named Tim.\n\nUser: Hi there!");
    expect(
      convertChatMessagesToText([
        { role: "system", content: "You are a friendly robot named Tim." },
        { role: "user", content: "Hi there!" },
        {
          role: "assistant",
          content: "Hello! I'm Tim. How can I help you today?",
        },
      ])
    ).toBe(
      "System: You are a friendly robot named Tim.\n\nUser: Hi there!\n\nAssistant: Hello! I'm Tim. How can I help you today?"
    );
  });

  test("convertTextToChatMessages", () => {
    expect(convertTextToChatMessages("")).toMatchObject([]);
    expect(convertTextToChatMessages("Hello there!")).toMatchObject([
      { role: "system", content: "Hello there!" },
    ]);
    expect(convertTextToChatMessages("System: Hello there!")).toMatchObject([
      { role: "system", content: "Hello there!" },
    ]);
    expect(
      convertTextToChatMessages(
        "System: Hello there!\n\nUser: I hate testing..."
      )
    ).toMatchObject([
      { role: "system", content: "Hello there!" },
      { role: "user", content: "I hate testing..." },
    ]);
    expect(
      convertTextToChatMessages(
        "System: Hello there!\n\nUser: I hate testing...\n\nAssistant: I could write them for you?"
      )
    ).toMatchObject([
      { role: "system", content: "Hello there!" },
      { role: "user", content: "I hate testing..." },
      { role: "assistant", content: "I could write them for you?" },
    ]);
    expect(
      convertTextToChatMessages(
        "\n\nHuman: I hate testing...\n\nAssistant: I could write them for you?"
      )
    ).toMatchObject([
      { role: "user", content: "I hate testing..." },
      { role: "assistant", content: "I could write them for you?" },
    ]);
  });
  test("parseTemplateStrings", () => {
    expect(parseTemplateStrings("")).toMatchObject([]);
    expect(parseTemplateStrings("Hello there!")).toMatchObject([]);
    expect(parseTemplateStrings("1 + 1 <= 3")).toMatchObject([]);
    expect(parseTemplateStrings("<<something else>>")).toMatchObject([]);
    expect(parseTemplateStrings("{}")).toMatchObject([]);
    expect(parseTemplateStrings("I <3 U")).toMatchObject([]);
    expect(parseTemplateStrings("I <love U")).toMatchObject([]);
    expect(parseTemplateStrings("I love> U")).toMatchObject([]);
    expect(
      parseTemplateStrings([
        { role: "system", content: "Hello there!" },
        { role: "user", content: "I hate testing..." },
        { role: "assistant", content: "I could write them for you?" },
      ])
    ).toMatchObject([]);

    expect(parseTemplateStrings("Hi, my name is <bot_name>!")).toMatchObject([
      "bot_name",
    ]);
    expect(
      parseTemplateStrings(
        "Hi, my name is <bot_name>! Have you ever wanted to beat me up? Well you can if you just say <bot_name>."
      )
    ).toMatchObject(["bot_name"]);
    expect(
      parseTemplateStrings([
        { role: "system", content: "You are a bot named <bot_name>." },
        { role: "user", content: "Hey <bot_name>, I hate testing..." },
      ])
    ).toMatchObject(["bot_name"]);

    expect(
      parseTemplateStrings(
        "Hi, my name is <bot_name>! I am an expert at <skill>, but I an also help you with <task>."
      )
    ).toMatchObject(["bot_name", "skill", "task"]);
    expect(
      parseTemplateStrings([
        {
          role: "system",
          content:
            "You are a bot named <bot_name>. You are on a mission to <mission>",
        },
        { role: "user", content: "Hey <bot_name>, I hate testing..." },
      ])
    ).toMatchObject(["bot_name", "mission"]);
  });

  test("hydratePromptInputs", () => {
    expect(hydratePromptInputs("", { bot_name: "Barry" })).toBe("");
    expect(
      hydratePromptInputs("<<something else>>", { bot_name: "Barry" })
    ).toBe("<<something else>>");
    expect(
      hydratePromptInputs("You are a bot named <bot_name>.", {
        bot_name: "Barry",
      })
    ).toBe("You are a bot named Barry.");
    expect(
      hydratePromptInputs(
        "Hi, my name is <bot_name>! I am an expert at <skill>, but I an also help you with <task>.",
        {
          bot_name: "Barry",
          skill: "Hockey",
          task: "cleaning your socks",
        }
      )
    ).toBe(
      "Hi, my name is Barry! I am an expert at Hockey, but I an also help you with cleaning your socks."
    );
    expect(
      hydratePromptInputs("<bot_name>,<bot_name>,<bot_name>", {
        bot_name: "Barry",
        skill: "Hockey",
        task: "cleaning your socks",
      })
    ).toBe("Barry,Barry,Barry");
    expect(
      hydratePromptInputs(
        [
          { role: "system", content: "You are a bot named <bot_name>." },
          { role: "user", content: "Hey <bot_name>, I hate testing..." },
        ],
        { bot_name: "Barry" }
      )
    ).toMatchObject([
      { role: "system", content: "You are a bot named Barry." },
      { role: "user", content: "Hey Barry, I hate testing..." },
    ]);
    expect(
      hydratePromptInputs(
        [
          {
            role: "system",
            content:
              "You are a bot named <bot_name>. You are on a mission to <mission>",
          },
          { role: "user", content: "Hey <bot_name>, I hate testing..." },
        ],
        { bot_name: "Barry", mission: "rule the world" }
      )
    ).toMatchObject([
      {
        role: "system",
        content:
          "You are a bot named Barry. You are on a mission to rule the world",
      },
      { role: "user", content: "Hey Barry, I hate testing..." },
    ]);
  });
});
