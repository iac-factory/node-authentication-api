#!/usr/bin/env node

import Path from "path";
import Subprocess from "child_process";

import FS from "fs";

export module Executable {
    export module Directory {
        /***
         * Promisified Version of {@link FS.readdir}
         * ---
         *
         * Asynchronously, reads the contents of a directory.
         *
         * The callback gets two arguments (`'err'`, `'files'`) where `'files'`
         * is an array of the names of the files in the directory excluding '.' and '..'.
         * The optional options argument can be a string specifying an encoding, or an object with an encoding
         * property specifying the character encoding to use for the filenames passed to the callback. If the encoding
         * is set to 'buffer', the filenames returned will be passed as Buffer objects.
         *
         * If options.withFileTypes is set to true, the files array will contain {@link fs.Dirent} objects.
         *
         * @experimental
         *
         * @param {string} target
         * @returns {Promise<void>}
         *
         * @constructor
         *
         */
        export const Reader = async ( target: string = process.cwd() ) => {
            /***
             * File Handler Validation
             * ---
             *
             * Asynchronously computes the canonical pathname by resolving `.`, `..` and symbolic links.
             *
             * <br/>
             *
             * A canonical pathname is not necessarily unique. Hard links and bind mounts can
             * expose a file system entity through many pathnames.
             *
             * <br/>
             *
             * This function behaves like [`realpath(3)`](http://man7.org/linux/man-pages/man3/realpath.3.html), with some exceptions:
             *
             * 1. No case conversion is performed on case-insensitive file systems.
             * 2. The maximum number of symbolic links is platform-independent and generally
             * (much) higher than what the native [`realpath(3)`](http://man7.org/linux/man-pages/man3/realpath.3.html) implementation supports.
             *
             * <br/>
             *
             * The `callback` gets two arguments `(err, resolvedPath)`. May use `process.cwd`to resolve relative paths.
             *
             * <br/>
             *
             * Only paths that can be converted to UTF8 strings are supported.
             *
             */
            const valid = () => {
                return new Promise( ( resolve ) => FS.realpath( target, { encoding: "utf-8" }, ( exception, path ) => {
                    resolve( ( exception ) ? false : !!( path ) );
                } ) );
            };

            /*** Simple `fs.readdir()` remapping of full file-system path(s) */
            const descriptors: Descriptors = async () => new Promise( ( resolve ) => {
                const handle: Handler = ( exception, files ) => {
                    if ( exception ) throw exception;

                    const descriptors = files.map( ( descriptor ) => {
                        const location = Path.resolve( target ?? process.cwd() );

                        return Path.join( location, descriptor.name );
                    } );

                    resolve( descriptors );
                };

                /*** @inheritDoc {@link Reader} */
                void FS.readdir( target, {
                    encoding: "utf-8",
                    withFileTypes: true
                }, handle );
            } );

            return ( await valid() ) ? await descriptors() : null;
        };

        export const Files = async ( path: string = CWD() ) => {
            const [ exception, files ] = await new Promise<[ NodeJS.ErrnoException | null, string[] ]>( async ( resolve, reject ) => {
                const directory = await Directory.Reader( path );

                if ( !( directory ) ) {
                    const error = new Error;
                    error.message = "Runtime Exception - No File(s) Found";
                    error.name = "Typescript-Compile-Evaluation-Exception";

                    reject( [ error, null ] );
                } else resolve( [ null, directory.map( ( descriptor ) => String( descriptor ) ) ] );
            } );

            if ( exception ) throw exception;

            return files;
        };

        /*** @inheritDoc Reader */
        export type Descriptors = () => Promise<FS.PathOrFileDescriptor[]>;
        export type Handler = ( exception: ( NodeJS.ErrnoException | null ), files: FS.Dirent[] ) => void;
    }

    /*** Strip Newline + Ensure Type := String */
    function normalize( command: Subprocess.SpawnSyncReturns<string> ) {
        function prototype( buffer: ( string | null )[] ) {
            return buffer.join( "" ).trim();
        }

        return ( command.output ) ? prototype( command.output ) : null;
    }

    export const Typescript = {
        /*** System Call that Searches for a `tsc` Executable */
        get command() {
            return () => Subprocess.spawnSync( "command", [ "-v", "tsc" ], {
                shell: false, cwd: process.cwd(), stdio: "pipe", encoding: "utf-8"
            } )
        },
        /*** Full System Path to `tsc` Executable */
        get path() {
            const output = this.command();

            return normalize( output );
        },
        /*** Ensure the `tsc` Path is Valid; Return Full System Path to Executable if Valid */
        get validation() {
            return async () => new Promise<[ NodeJS.ErrnoException, null ] | [ null, string ]>( ( resolve, reject ) => {
                const path = Typescript.path;

                if ( !( path ) ) {
                    const error = new Error;
                    error.message = "Typescript Executable Not Found";
                    error.name = "Typescript-Command-Exception";

                    reject( [ error, null ] );
                } else resolve( [ null, path ] );
            } );
        },
        /*** TSC Environment Variable(s) */
        get settings() {
            return {
                ...process.env, ...{
                    NODE_ENV: "testing",
                    FORCE_COLOR: "true",
                    NODE_NO_WARNINGS: "1"
                }
            }
        },
        /*** Check the Root Package for `tsconfig.json`; Return `true` if Buildable */
        build: async function (): Promise<[ boolean, { target: string, filename: string, configuration: boolean, directory: string } ]> {
            const files = ( await Directory.Files() ).map( ( file ) => {
                return {
                    target: String( file ),
                    filename: Path.basename( String( file ) ),
                    directory: Path.dirname( String( file ) ),
                    configuration: Path.basename( String( file ) ) === "tsconfig.json"
                }
            } );

            const target = files.filter( ( mapping ) => mapping.configuration );

            if ( target.length !== 0 && target.length > 1 ) {
                throw new Error( "Fatal, Unknown Runtime Logic Error" );
            }

            return [ target.map( ( entry ) => entry.configuration ).includes( true ), target.pop()! ];
        },
        /*** Compile Typescript */
        compile: async function () {
            const [ proceed, metadata ] = await this.build();

            const { target, directory, configuration } = metadata;

            if ( proceed && configuration ) {
                const [ exception, path ] = await this.validation();

                if ( exception ) throw exception;

                void Subprocess.spawnSync( path, [ "--build", target, "--diagnostics" ], {
                    shell: false,
                    cwd: directory,
                    stdio: "inherit",
                    encoding: "buffer",
                    env: this.settings
                } );
            }

            return;
        }
    }

    export const Jest = {
        /*** System Call that Searches for a `jest` Executable */
        get command() {
            return () => Subprocess.spawnSync( "command", [ "-v", "jest" ], {
                shell: false, cwd: process.cwd(), stdio: "pipe", encoding: "utf-8"
            } )
        },
        /*** Full System Path to `jest` Executable */
        get path() {
            const output = this.command();

            return normalize( output );
        },
        /*** Jest Environment Variable(s) */
        get configuration() {
            return {
                ...process.env, ...{
                    NODE_ENV: "testing",
                    FORCE_COLOR: "true",
                    NODE_NO_WARNINGS: "1"
                }
            }
        }
    };

    export const Package = {
        /*** System Call that Indexes Any NPM Package's Root Directory */
        get command() {
            /*** Due to differences in repository/package structures, the following command is required to accurately get a system path */
            return () => Subprocess.spawnSync( "npm", [ "root" ], {
                shell: false, cwd: process.cwd(), stdio: "pipe", encoding: "utf-8"
            } );
        }, get path() {
            const output = normalize( this.command() );
            return ( output ) ? Path.dirname( output ) : null;
        }
    };

    export const Parameters = () => {
        const jest = Jest.path;

        if ( !( jest ) ) throw new Error( "Runtime Exception - `jest` Callable Not Found" );

        const update = process.argv.includes("--update-snapshots") || process.argv.includes("--update") || process.argv.includes("-u");

        return (update) ? [
            "--experimental-vm-modules", jest, "--config", "jest.config.js", "--injectGlobals", "--detectOpenHandles", "-u"
        ] : [
            "--experimental-vm-modules", jest, "--config", "jest.config.js", "--injectGlobals", "--detectOpenHandles"
        ];
    };

    export const CWD = () => {
        const pkg = Package.path;

        if ( !( pkg ) ) throw new Error( "Runtime Exception - \"${PWD}\" Isn't an NPM Package" );

        return pkg;
    };

    export const Run = async () => {
        await Typescript.compile();

        const $ = Subprocess.spawnSync( "node", Parameters(), {
            shell: false, cwd: CWD(), stdio: "inherit", encoding: "buffer", env: Jest.configuration
        } );

        ( $.stderr ) && Reflect.set( process, "exitCode", 255 );

        process.exit();
    };
}

export default void ( async () => Executable.Run() )();
