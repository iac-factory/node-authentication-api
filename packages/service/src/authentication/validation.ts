import { Logger } from "@iac-factory/api-utilities";

import Token, { Jwt } from "jsonwebtoken";

import { Context } from "@iac-factory/api-database";

const Log = new Logger( "Authorization" );

function Valid( evaluations: Array<boolean> ) {
    return evaluations.every( ( element: boolean ) => {
        return element === evaluations[ 0 ];
    } );
}

/***
 * JWT Verification
 * ---
 * @returns {void}
 *
 * @constructor
 * @param jwt
 * @param origin
 */
export const Validation = async function ( jwt: string, origin: string ) {
    Log.debug( "JWT", { jwt, origin } );

    /***
     * Unverified, Decoded JWT
     * ---
     * It's elected to use an unverified method prior `Token.verify` due
     * to any given JWT's *publicly* available properties. For example,
     * the expiration and origin (IP-Address) claims can be checked
     * also while grabbing the User's database record.
     *
     * */
    const target = Token.decode( jwt, {
        complete: true, json: true
    } ) as ( Jwt & { payload: { id: string, uid: string, exp: number, iat: number, sub: string } } );

    if ( !( target?.payload ) || !( target.payload.sub ) || !( target.payload.uid ) || !( target.payload.iat ) ) return false;

    const time = new Date( Date.now() );

    const user = target.payload.sub;

    const expiration = new Date( target.payload.exp * 1e3 );

    const validation = { origin: false, username: false, expiration: false };

    /*** User Database Record */
    const context = await Context.Connection();
    const database = context.db( "Authentication" );
    const users = database.collection( "User" );

    const record = await users.findOne( { username: target.payload.sub } );

    if ( !( record ) ) return false;

    validation.username = record?.username === user;
    validation.origin = record?.login?.origin === origin;
    validation.expiration = time < expiration;

    const valid = Valid( Object.values( validation ) );

    if ( !( valid ) ) {
        return false;
    }

    const session = {
        date:       time,
        expiration: expiration,
        token:      jwt,
        origin:     origin
    };

    await users.updateOne(
        { _id: record._id },
        { $set: { login: session } }
    );

    try {
        const proceed = !!( Token.verify( jwt, process.env[ "SECRET" ]!, {
            complete: true, issuer: process.env[ "ISSUER" ]!, subject: user
        } ) );

        return ( proceed ) ? { username: record?.username } : false;
    } catch ( exception ) {
        return false
    }
};

export default Validation;
