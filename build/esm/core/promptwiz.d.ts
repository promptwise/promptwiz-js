import { Promptwiz, PromptwizConfig } from "./types";
export declare function promptwiz<Inputs extends Record<string, string> | void = void>(config: PromptwizConfig<Inputs>): Promptwiz<Inputs>;
