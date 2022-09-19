import FS from "fs";
import Path from "path";

import Module from "./certificates.json";

import { Logger } from "@iac-factory/api-utilities";

export module TLS {
    const $ = { initialize: false };

    const Debugger = new Logger("TLS");

    export const Certificates = {
        "global-bundle": {
            get content() {
                return FS.readFileSync(this.path, "utf-8");
            },
            get path() {
                return Path.join(__dirname, this.filename);
            },
            get filename() {
                return "global-bundle.pem";
            }
        },
        "rds-ca-2019.us-east-2": {
            get content() {
                return FS.readFileSync(this.path, "utf-8");
            },
            get path() {
                return Path.join(__dirname, this.filename);
            },
            get filename() {
                return "rds-ca-2019.us-east-2.pem";
            }
        },
        "rds-combined-ca-bundle": {
            get content() {
                return FS.readFileSync(this.path, "utf-8");
            },
            get path() {
                return Path.join(__dirname, this.filename);
            },
            get filename() {
                return "rds-combined-ca-bundle.pem";
            }
        },
        "us-east-2-bundle": {
            get content() {
                return FS.readFileSync(this.path, "utf-8");
            },
            get path() {
                return Path.join(__dirname, this.filename);
            },
            get filename() {
                return "us-east-2-bundle.pem";
            }
        }
    };

    /*** Write a Certificate to File-System */
    export async function write(certificate: TLS.File, pwd?: string | FS.PathLike) {
        // Logical nullish assignment (??=)
        pwd ??= process.cwd();

        const {
            filename,
            content
        } = Certificates[certificate];

        const path = Path.join(String(pwd), filename);

        void await FS.promises.writeFile(path, content, "utf-8");

        return path;
    }

    export async function Setup() {
        (process.env?.["NODE_ENV"] !== "testing") && Debugger.debug("Certificate", "Writing PEM File(s)");

        return !($.initialize) ? new Promise <boolean> (async (resolve, reject) => {
            const certificates = Object.entries(Module);

            async function Writer (certificate: string, offset: Buffer | string) {
                const filename = [ certificate, "pem" ].join(".");
                const target = Path.join(__dirname, filename);
                const buffer = Buffer.from((offset as string), "base64");

                const content = buffer.toString("ascii");

                void await FS.promises.writeFile(target, content, "utf-8");

                (process.env?.["NODE_ENV"] !== "testing") && Debugger.debug("Certificate", "Successfully Wrote to" + " " + Path.basename(target));
            }

            for await (const [ certificate, offset ] of certificates) {
                void await Writer(certificate, offset);
            }

            Reflect.set($, "initialize", true);

            resolve(true);
        }) : true;
    }

    export async function Clean() {
        (process.env?.["NODE_ENV"] !== "testing") && Debugger.debug("Certificate", "Removing PEM File(s)");

        return new Promise <boolean> (async (resolve, reject) => {
            const certificates = Object.entries(Module);

            async function Remover (certificate: string) {
                const filename = [ certificate, "pem" ].join(".");
                const target = Path.join(__dirname, filename);

                void await FS.promises.rm(target, { force: true, recursive: false });

                (process.env?.["NODE_ENV"] !== "testing") && Debugger.debug("Certificate", "Successfully Removed" + " " + Path.basename(target));
            }

            for await(const [ certificate, _ ] of certificates) {
                void await Remover(certificate);
            }

            resolve(true);
        });
    }

    export enum Certificate {
        "global-bundle" = "global-bundle",
        "rds-ca-2019.us-east-2" = "rds-ca-2019.us-east-2",
        "rds-combined-ca-bundle" = "rds-combined-ca-bundle",
        "us-east-2-bundle" = "us-east-2-bundle",
    }

    export type File = keyof typeof Certificate;

    (async () => TLS.Setup())();
}
