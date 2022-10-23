/***
 * Narrowing Type Validator
 *
 * @param {Generic | undefined} input
 * @param {any} properties
 * @return {Required<Generic>}
 */
export function validate<Generic>(input: Generic | undefined, ... properties: ( object | boolean | number | null | undefined | Function["prototype"] )) {
    if ( !( input ) ) {
        throw Error("Validation Failure - Received Null Value as Input");
    }

    // @ts-ignore
    return input! as Required<Generic>;
}

export default validate;