import { Logger } from "@iac-factory/api-authentication-utilities";

import Token, { Jwt } from "jsonwebtoken";

import { Context } from "@iac-factory/api-authentication-database";

const Log = new Logger( "Authorization" );

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
    const target = Token.verify( jwt, process.env["SECRET"]! ) as Jwt & { id?: string, scopes?: string[], iss?: string, iat?: number, sub?: string, exp?: number };

    Log.debug( "JWT-Partials", { target } );

    if ( !( target.sub ) || !( target.iat ) || !(target.exp) ) return false;

    const time = new Date( Date.now() );

    const username = target.sub;
    const issuer = target.iss;

    const expiration = new Date( target.exp * 1e3 );

    const validation = { origin: false, username: false, expiration: false };

    /*** User Database Record */
    const context = await Context.Connection();
    const database = context.db( "Authentication" );
    const users = database.collection( "User" );

    const record = await users.findOne( { username } );

    if ( !( record ) ) return false;

    validation.username = record?.username === username;
    validation.origin = record?.login?.origin === origin;
    validation.expiration = time < expiration;

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
        Log.debug( "Issuer", { issuer } );

        const proceed = !!( Token.verify( jwt, process.env[ "SECRET" ]!, {
            complete: true, issuer, subject: username
        } ) );

        return ( proceed ) ? { username: record?.username } : false;
    } catch ( exception ) {
        Log.warning( "JWT-Failure", { exception } );

        return false
    }
};

export default Validation;
