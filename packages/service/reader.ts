import FS from "fs";
import Path from "path";
import Process from "process";

export module Reader {
    export function Schema( descriptor: FS.Dirent, location: string ): Descriptor {
        return {
            name:       descriptor.name,
            path:       location,
            relative:   [ ".", Path.sep, Path.relative( process.cwd(), location ) ].join( "" ),
            attributes: {
                type: Path.extname( descriptor.name ),

                file:      descriptor.isFile(),
                directory: descriptor.isDirectory(),
                socket:    descriptor.isSocket(),
                Symbolic:  descriptor.isSymbolicLink()
            }
        };
    }

    export function * Descriptors( directory: string ): Generator<Descriptor> {
        const Handles = FS.readdirSync( directory, { withFileTypes: true } );

        for ( const descriptor of Handles ) {
            const location = Path.join( directory, descriptor.name );

            if ( descriptor.isDirectory() ) {
                yield * Descriptors( location );
            }

            yield Schema( descriptor, location );
        }
    }

    export function * Files( directory: string ): Generator<Descriptor> {
        const Handles = FS.readdirSync( directory, { withFileTypes: true } );

        for ( const descriptor of Handles ) {
            const location = Path.join( directory, descriptor.name );

            if ( descriptor.isDirectory() ) {
                yield * Files( location );
            } else {
                yield Schema( descriptor, location );
            }
        }
    }

    export type Descriptor = { readonly name: string, readonly path: string, readonly relative: string, readonly attributes: { readonly type: string, readonly file: boolean, readonly directory: boolean, readonly socket: boolean, readonly Symbolic: boolean } };
}