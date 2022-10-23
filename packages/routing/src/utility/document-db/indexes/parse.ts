export const Parse = async ( name: string ): Promise<Index[]> => {
    const { Context } = await import("@iac-factory/api-authentication-database");

    const context = await Context.Connection();

    const database = context.db( name );

    const db = database.databaseName;
    const collections = database.listCollections();
    const stream = collections.stream();

    const data = Object.create( {} )

    for await ( const document of stream ) {
        const { name } = document;
        const { type } = document;

        if ( type === "collection" ) {
            const collection = await database.collection( name );

            const cursor = collection.listIndexes( {
                dbName: db
            } );

            const indexes: Index[] = await cursor.toArray();

            cursor.rewind();

            const filter = indexes.filter( ( index ) => !( Object.keys( index.key ).includes( "_id" ) ) );

            data[ collection.namespace ] = filter;
        }
    }

    return data;
};

export default Parse;

export type Index = {
    v: number,
    key: { _id?: number } & { [ $: string ]: number },
    name: string,
    ns: string
}