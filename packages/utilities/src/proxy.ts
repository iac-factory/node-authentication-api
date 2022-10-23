import Subprocess from "child_process";

import { TLS } from "@iac-factory/api-authentication-tls";

import { Prompts, Environment } from ".";

enum Configuration {
    LOCAL_PORT = "LOCAL_PORT",
    DATABASE_HOSTNAME = "DATABASE_HOSTNAME",
    DATABASE_PORT = "DATABASE_PORT",
    BASTION_USERNAME = "BASTION_USERNAME",
    BASTION_HOSTNAME = "BASTION_HOSTNAME",
    BASTION_SSH_KEY = "BASTION_HOSTNAME",
}

export const Proxy = async (tls: boolean = true, configuration: {"local-port"?: string, "database-hostname"?: string, "database-port"?: string, "bastion-username"?: string, "bastion-hostname"?: string, "bastion-ssh-key"?: string} = {}) => {
    (tls) && await TLS.Home();

    const { spawn } = Subprocess;

    if ( process.stdin.isTTY ) {
        await Prompts.Handler();

        await Environment.Loader();

        const keys = Object.keys(Configuration);

        const questions = Environment.Settings(keys, process.env);

        if (Object.keys(configuration).length === 0) {
            const answers = await Prompts.Prompt(questions);

            for ( const variable of Object.keys(answers) ) {
                const { key, value } = answers[ variable ]!;

                process.env[ key ] = value;
            }
        }
    }

    configuration["bastion-hostname"] ??= process.env["BASTION_HOSTNAME"];
    configuration["bastion-username"] ??= process.env["BASTION_USERNAME"];
    configuration["bastion-ssh-key"] ??= process.env["BASTION_SSH_KEY"];
    configuration["database-hostname"] ??= process.env["DATABASE_HOSTNAME"];
    configuration["database-port"] ??= process.env["DATABASE_PORT"];
    configuration["local-port"] ??= process.env["LOCAL_PORT"];

    const proxy = [ "localhost", configuration["local-port"], configuration["database-hostname"], configuration["database-port"] ].join(":");
    const bastion = [ configuration["bastion-username"], configuration["bastion-hostname"] ].join("@");

    /*** Strictly-Typed SSH Tunnel + Reverse Port-Forward Proxy Command */
    const parameters: Readonly<[ "-L", string, string, "-i", string, "-N", "-v" ]> = [ "-L", proxy, bastion, "-i", configuration["bastion-ssh-key"]!, "-N", "-v" ];

    console.debug("[Proxy]", [ "ssh", ... parameters ]);

    const filter = (input: Buffer | string[]) => {
        const state = { input: "" };

        if ( input instanceof Buffer ) {
            state.input = input.toString("utf-8");
        } else if ( input instanceof Array ) {
            state.input = input.map(($) => $.trim()).join("");
        } else {
            state.input = input;
        }

        if ( state.input.includes("debug") ) {
            state.input = state.input.split(":").pop() as string;
        }

        state.input = state.input.trim();

        return state.input;
    };

    const subprocess = spawn("ssh", parameters, {
        // shell: false, stdio: "inherit", detached: true
        shell: false, stdio: "pipe", detached: false
    });

    subprocess.on("error", (error) => {
        throw error;
    });

    /***
     * Output often contains more than a single empty line to use as separation contexts.
     *
     * The following filter aims to eliminate useless output; consecutive empty lines are limited to
     * a single line.
     */
    subprocess.stdio[ 2 ].on("data", async (output: Buffer | string[]) => {
        const log = filter(output);

        ( log ) && process.stdout.write(
            "[Proxy]" + " " + log + "\n", (exception) => {
                if ( exception ) throw exception;
            }
        );

    });

    subprocess.on("close", (code: number) => {
        subprocess.kill("SIGTERM");
    });

    /***
     * By default, the parent will wait for the detached child to exit. To
     * prevent the parent from waiting for a given subprocess to exit, use
     * the subprocess.unref() method. Doing so will cause the parent's event
     * loop to not include the child in its reference count, allowing the
     * parent to exit independently of the child, unless there is an established
     * IPC channel between the child and the parent.
     */

    /*** *.unref() for Detachment (Useful for Tunnel-Required Runtimes */
    // ( dissociate ) && subprocess.unref();

    process.on("exit", () => {
        subprocess.kill("SIGTERM");
    });

    return await new Promise<Subprocess.ChildProcess>((resolve) => {
        /*** Event Listener - Safe Mutex-Unlock Upon Successful SSH Tunnel */
        subprocess.on("spawn", async () => {
            resolve(subprocess);
        });
    });
};

export default Proxy;
