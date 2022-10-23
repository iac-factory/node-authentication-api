import { Postgres } from ".";

export const Connection = {
    connection: (null as (null | typeof Postgres)),

    async create() {
        if (!(this.connection)) {
            this.connection = await Postgres.connect();
        }

        return this.connection;
    },

    async close() {
        return Postgres.destroy();
    },

    async clear() {
        const connection = await this.create();
        const entities = connection.entityMetadatas;

        const promises = entities.map((entity) => async () => {
            const repository = Postgres.getRepository(entity.name);
            void repository.clear();
            return true;
        });

        void await Promise.all((promises.map(($) => $())));
    }
};

export default Connection;
