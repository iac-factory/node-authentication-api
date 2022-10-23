import OS from "os";
import FS from "fs";
import Path from "path";

export module TLS {
    const $ = { initialize: false };

    export const Certificates = {
        "global-bundle": {
            get content() {
                return FS.readFileSync(this.path, "utf-8");
            },
            get path() {
                return Path.join(process.cwd(), this.filename);
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
                return Path.join(process.cwd(), this.filename);
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
                return Path.join(process.cwd(), this.filename);
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
                return Path.join(process.cwd(), this.filename);
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
        return !($.initialize) ? new Promise <boolean> (async (resolve, reject) => {
            const module = await FS.promises.readFile(Path.join(__dirname, "certificates.json"), {encoding: "utf-8"});

            const certificates = Object.entries(JSON.parse(module));

            async function Writer (certificate: string, offset: Buffer | string | unknown) {
                const filename = [ certificate, "pem" ].join(".");
                const target = Path.join(process.cwd(), filename);
                const buffer = Buffer.from(( offset as string ), "base64");

                const content = buffer.toString("ascii");

                void await FS.promises.writeFile(target, content, "utf-8");
            }

            for await (const [ certificate, offset ] of certificates) {
                void await Writer(certificate, offset);
            }

            Reflect.set($, "initialize", true);

            resolve(true);
        }) : true;
    }

    export async function Clean() {
        return new Promise <boolean> (async (resolve, reject) => {
            const module = await FS.promises.readFile(Path.join(__dirname, "certificates.json"), {encoding: "utf-8"});

            const certificates = Object.entries(JSON.parse(module));

            async function Remover (certificate: string) {
                const filename = [ certificate, "pem" ].join(".");
                const target = Path.join(__dirname, filename);

                void await FS.promises.rm(target, { force: true, recursive: false });
            }

            for await(const [ certificate, _ ] of certificates) {
                void await Remover(certificate);
            }

            resolve(true);
        });
    }

    export async function Home() {
        await Setup();

        const directory = await FS.promises.realpath(OS.homedir());

        try {
            await FS.promises.mkdir(Path.join(directory, ".tls"));
        } catch ( exception ) {
            /*** Continue */
        }

        for (const file of Object.keys(Certificate)) {
            const filename = file + "." + "pem";

            const source = Path.join(process.cwd(), filename);
            const target = Path.join(directory, ".tls", filename);

            await FS.promises.copyFile(source, target);
        }
    }

    export enum Certificate {
        "global-bundle" = "global-bundle",
        "rds-ca-2019.us-east-2" = "rds-ca-2019.us-east-2",
        "rds-combined-ca-bundle" = "rds-combined-ca-bundle",
        "us-east-2-bundle" = "us-east-2-bundle",
    }

    export type File = keyof typeof Certificate;
}
