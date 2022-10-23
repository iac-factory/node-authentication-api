import Input from "readline";

import type { Questions } from "./types";
import type { Settings } from "./types";
import type { Answers } from "./types";
import type { State } from "./types";

/***
 * @example
 * ( async () => {
 *     const answers = await Prompt( [
 *         { key: "CI", type: String }
 *     ] ).catch( ( Utility.inspect ) );
 *
 *     console.log( answers );
 * } )();
 *
 * @param {Questions} questions
 * @param {Settings} settings
 * @return {Promise<unknown>}
 * @constructor
 */
export async function Prompt(questions: Questions, settings?: Settings): Promise<Answers> {
    if ( settings?.normalize ?? true ) {
        /*** Normalize Question Prompts */
        questions.forEach((question, index) => {
            if ( question?.prompt && question.prompt.includes(":") ) {
                questions[ index ]!.prompt = questions[ index ]!.prompt!.split(":")[ 0 ]! + ":" + " ";
            } else if ( question?.prompt ) {
                questions[ index ]!.prompt = questions[ index ]!.prompt + ":" + " ";
            } else {
                questions[ index ]!.prompt = questions[ index ]!.key + ":" + " ";
            }
        });
    }

    const answers: Answers = {};

    const prompts: {key: string, prompt?: string, value: string | null }[] = [];

    for (const question of questions) {
        if (!("value" in question && typeof question.value === "string" || typeof question.value === "number")) {
            const target = {
                key: question.key,
                prompt: question.prompt,
                value: null
            };

            prompts.push(target);
        }
    }

    for ( var index = 0; index < questions.length; index++ ) {
        if ( questions[ index ]!.value ) {
            answers[ questions[ index ]!.key! ] = {
                key: questions[ index ]!.key,
                value: questions[ index ]!.value!
            };
        }
    }

    process?.stdin?.emit("open");

    return new Promise<Answers>((resolve, reject) => {
        const container = Object.create({});

        const total = prompts.length;
        const output: State = { counter: 0 };

        const Interface = Input.createInterface({
            input: process.stdin,
            output: process.stdout,
            terminal: process.stdout.isTTY,
            historySize: 0
        });

        if ( prompts.length === 0 && Object.keys(answers).length > 0 ) {
            Interface.close();

            resolve(answers);
        } else if ( !( questions[ output.counter ] )?.prompt || ( prompts.length < 1 ) ) {
            throw new Error("Error Establishing Question's Output Counter");
        }

        Interface.setPrompt(prompts[ output.counter ]!.prompt!);

        Interface.on("line", (data) => {
            ( prompts[ output.counter ] ) && Object.assign(prompts[ output.counter ]!, { ... prompts[ output.counter ], value: data });

            output.counter++;

            if ( output.counter === total ) {
                Interface.close();

                for ( const variable of prompts ) {
                    container[ variable.key ] = {
                        key: variable.key,
                        value: variable.value
                    };
                }

                for ( const [ key, _ ] of Object.entries(answers) ) {
                    if ( answers[ key ] && answers[ key ]!.key && answers[ key ]!.value ) {
                        container[ key ] = {
                            key: answers[ key ]!.key,
                            value: answers[ key ]!.value
                        };
                    }
                }

                resolve(container);
            } else {
                Interface.setPrompt(prompts[ output.counter ]!.prompt!);

                Interface.prompt();
            }
        });

        try {
            Interface.prompt();
        } catch ( _ ) {
            reject(_);
        } finally {
            process?.stdin?.emit("close");
        }
    }).catch((exception) => {
        throw exception;
    });
}

export type { Questions, Answers };

export default Prompt;