import { Context } from "@iac-factory/api-authentication-database";
import Mongo from "mongodb";
import { Readable } from "stream";

import type { User } from "./types";
import Utility from "util";

export module Users {
    import Document = Mongo.Document
    import WithId = Mongo.WithId;
    import AbstractCursor = Mongo.AbstractCursor;

    const State: { instance: import("mongodb").MongoClient | null, client: import("mongodb").Db | null } = { client: null, instance: null }

    export async function Initialize(): Promise<{ instance: import("mongodb").MongoClient, connection: import("mongodb").Db, collection: import("mongodb").Collection<import("mongodb").Document> }> {
        if ( !( State.client ) || !( State.instance ) ) {
            const context = await Context.Connection();

            State.instance = context;

            State.client = context.db( "Authentication" );
        }

        if ( !( State.instance ) ) throw new Error( "Client-Instance-Initialization-Exception" );
        if ( !( State.client ) ) throw new Error( "Client-Initialization-Exception" );

        return {
            instance: State.instance, connection: State.client, collection: State.client.collection( "User" )
        };
    }

    export const Instance = async (): Promise<import("mongodb").MongoClient> => {
        if ( !( State.instance ) ) await Initialize();

        return State.instance!;
    }

    export const Total = async (): Promise<number> => {
        const client = await Initialize();

        const { collection } = client;

        const total = await collection.countDocuments();

        return total;
    };

    export const Statistics = async (): Promise<import("mongodb").CollStats> => {
        const client = await Initialize();

        const { collection } = client;

        const statistics = await collection.stats()

        return statistics;
    };

    export const Indexes = async (): Promise<import("mongodb").Document[]> => {
        const client = await Initialize();

        const { collection } = client;

        const indexes = await collection.indexes()

        return indexes;
    };

    export const Documents = async ( stream: boolean = false ) => {
        const client = await Initialize();

        const { collection } = client;

        const users: WithId<Document>[] | ( Readable & AsyncIterable<WithId<Document>> ) = ( stream ) ? await collection.find().stream() : await collection.find().toArray();

        return users;
    };

    /***
     * MongoDB cursor has two methods that makes paging easy; they are
     *
     *     cursor.skip()
     *     cursor.limit()
     *
     * skip(n) will skip n documents from the cursor while limit(n) will cap the number of documents to be returned from the cursor. Thus combination of two naturally paginates the response.
     *
     * In Mongo Shell your pagination code looks something like this
     *
     *     // Page 1
     *     db.students.find().limit(5)
     *
     *     // Page 2
     *     db.students.find().skip(5).limit(5)
     *
     *     // Page 3
     *     db.students.find().skip(5).limit(5)
     *
     * @constructor
     * @param total
     * @param page
     * @param sort
     */
    export const Pagination = async ( total: number, page: number, sort?: { order: "ascending" | "descending", field: string } ): Promise<WithId<Document>[]> => {
        const normalize = ( page - 1 );
        const client = await Initialize();

        const { collection } = client;

        if (sort) {
            const { order } = sort;
            const { field } = sort;

            const filter: import("mongodb").Sort = {
                [field]: (order === "descending") ? -1 : (order === "ascending") ? 1 : 0
            } as import("mongodb").Sort

            return await (collection.find().skip( ( normalize <= 0 ) ? 0 * total : normalize * total ).limit( total ).sort(filter).toArray());
        } else {
            return await collection.find().skip( ( normalize <= 0 ) ? 0 * total : normalize * total ).limit( total ).toArray();
        }
    };

    export const Page = async ( total: number, page: number ) => {
        try {
            const { collection } = await Initialize();

            const pages = Math.ceil( ( await collection.countDocuments() / total ) );

            /*** Construct Input for {@link Users.Pagination} API Endpoint for Ease of Use on Front-End */
            const pagination = [ total, page ];

            /*** Construct Input for {@link Users.Page} Next Page API Endpoint for Ease of Use on Front-End */
            const payload = [ total, page + 1 ];

            const final = [ total, pages ];

            const data = new ( class extends Array {
                rows = total;
                last = pages;
                current = page + 1;
                next = ( ( this.current + 1 ) < pages ) ? this.current + 1 : null;
                previous = ( ( this.current ) > 0 ) ? this.current - 1 : null;
                payload = { current: pagination, next: payload, last: final, previous: ( ( this.current ) > 0 ) ? this.current - 1 : null };

                response() {
                    this.push( ... [ 1, ( ( page + 0 ) < pages ) ? this.current + 0 : null, ( ( page + 1 ) < pages ) ? this.current + 1 : null, ( ( page + 2 ) < pages ) ? this.current + 2 : null, ( ( page + 3 ) < pages ) ? this.current + 3 : null] );
                    return {
                        /*** The number of rows to set for rendering tabular data */
                        rows: this.rows,
                        /*** The Current Page Index */
                        current: this.current,
                        /*** The Next Page Index */
                        next: this.next,
                        /*** The Previous Page Index */
                        previous: this.previous,
                        /*** The Last Page Index */
                        last: this.last,
                        /*** For use with {@link Users.Pagination} & {@link Users.Page} */
                        payload: this.payload,
                        /***
                         * @type {number[]}
                         */
                        iterator: [ ... this ] as number[]
                    }
                }
            } )();

            return data.response() ?? null;
        } catch ( exception ) {
            console.trace( exception );

            return null;
        }
    };

    export module Search {
        export const ID = async ( { identifier }: { identifier: string } ): Promise<User | null> => {
            const client = await Initialize();

            const { collection } = client;

            return collection.findOne( { id: identifier } ) as {} as User;
        }
    }

    export const All = async (): Promise<User[]> => {
        const client = await Initialize();

        const { collection } = client;

        return collection.find().toArray() as {} as User[];
    }
}