import FS from "fs";

/***
 * Asynchronously copies the entire directory structure from source to destination, including subdirectories and files.
 * - When copying a directory to another directory, globs are not supported.
 *
 * @experimental
 *
 * @param source {typeof import("fs").PathOrFileDescriptor} source path to copy.
 * @param target {typeof import("fs").PathOrFileDescriptor} destination path to copy to.
 * @returns {Promise<?>}
 *
 * @constructor
 *
 */
export const Copy = async (source: string, target: string): Promise<string | NodeJS.ErrnoException> => {
    return new Promise(async (resolve, reject) => {
        const signal: { void: true | NodeJS.ErrnoException } = { void: true };

        try {
            await FS.promises.cp(source, target, {
                    recursive: true,
                    dereference: true,
                    preserveTimestamps: false,
                    errorOnExist: false,
                    force: true
                }
            );
        } catch ( exception ) {
            Object.assign(signal.void, exception);
        }

        if ( !( signal.void ) ) {
            resolve(target);
        }

        reject(signal.void);
    });
};

export default Copy;