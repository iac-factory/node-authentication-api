import * as prompt from "./prompt";
import * as handler from "./handler";

export module Prompts {
    export const { Handler } = handler;
    export const { Prompt } = prompt;
}

export default Prompts.Prompt;

export * from "./types";