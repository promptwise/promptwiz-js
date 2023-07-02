import * as React from "react";
import { CodeBlock } from "./Code";
import {
  codeDemoWrapperStyle,
  logsWrapperStyle,
  logLineStyle,
  formWrapperStyle,
} from "./CodeDemo.css";

export function LogLine({
  time,
  children,
}: React.PropsWithChildren<{ time: string | number; }>) {
  return (
    <code className={logLineStyle}>
      <div
        style={{ width: "10rem", display: "inline-block", marginRight: "16px" }}
      >
        {time}
      </div>
      <div style={{ display: "inline-block" }}>{children}</div>
    </code>
  );
}

export const DemoContext = React.createContext({ log: (text: string) => {} });

type LogT = {
  time: number;
  text: string;
};

export class CodeDemo extends React.Component<
  {
    code: string;
    Form: React.ComponentType<{
      onSubmit: (onSubmit: (values: {}) => unknown) => React.ReactElement;
    }>;
    className?: string | undefined;
  },
  { logs: LogT[] }
> {
  state: { logs: LogT[] };
  log: (text: string) => unknown;
  demoContext: { log: (text: string) => unknown };
  submitJson: (json: {}) => unknown | Promise<unknown>;

  constructor(props) {
    super(props);

    this.state = { logs: [] };

    this.log = (text: string) =>
      this.setState(({ logs }) => {
        logs.unshift({
          time: window.performance.now(),
          text,
        });
        return { logs };
      });

    this.submitJson = (values) =>
      this.log(`Form submit: ${JSON.stringify(values)}`);

    this.demoContext = { log: this.log };
  }

  render() {
    const { code, Form, className } = this.props;
    return (
      <div className={`${codeDemoWrapperStyle} ${className || ""}`}>
        <CodeBlock>{code}</CodeBlock>
        <div className={formWrapperStyle}>
          <DemoContext.Provider value={this.demoContext}>
            {/*
            // @ts-expect-error */}
            <Form submitJson={this.submitJson} />
          </DemoContext.Provider>
        </div>
        <pre className={logsWrapperStyle}>
          {this.state.logs.length ? (
            this.state.logs.map((l, i) => (
              <LogLine key={`${l.time}${i}`} time={l.time}>
                {l.text}
              </LogLine>
            ))
          ) : (
            <LogLine time="">{"  "}</LogLine>
          )}
        </pre>
      </div>
    );
  }
}
