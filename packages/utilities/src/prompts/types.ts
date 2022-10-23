/***
 * An Array of Question(s) to Feed into the Prompt Function
 */
export type Questions = ( { value?: null | string; key: string; prompt?: string } )[];

export type Answers = { [ $: string ]: { key: string; value: string; } };

export type State = { counter: number }

export interface Settings {
    /*** Lowercase all keys in return data structure - evaluates to true by default */
    normalize?: boolean;
}

export default Questions;