#!/usr/bin/env node

import FS from "fs";
import Path from "path";
import Subprocess from "child_process";

import { Prompts } from "@iac-factory/api-utilities";

const Packages = async () => {
    const directory = process.cwd();

    const target = Path.dirname(Path.join(directory, ".."));

    (Path.basename(directory) === "ci") && process.chdir(target);

    const exclusions = [ "ci" ];
    const directories: string[] = [];
    const descriptors = FS.readdirSync(Path.join(target, "packages"), {
        withFileTypes: true
    });

    for await (const descriptor of descriptors) {
        const excluded = (exclusions.includes(descriptor.name));

        if (descriptor.isDirectory() && !(excluded)) {
            directories.push(Path.join(target, "packages", descriptor.name));
        }
    }

    return directories;
};

(async () => {
    const { Handler, Prompt } = Prompts;

    void await Handler(true);

    const directory = process.cwd();

    const target = Path.dirname(Path.join(directory, ".."));

    (Path.basename(directory) === "ci") && process.chdir(target);

    const { Token } = await Prompt([ {
        prompt: "GitHub Personal-Access-Token (GH_TOKEN)" + ":" + " ",
        key: "Token"
    } ], { normalize: false });

    if (!(Token) || Token.value === "") throw new Error("Token Validation Error - Invalid Prompt Input");

    Reflect.set(process.env, "GH_TOKEN", Token.value);

    if (!(process.env?.["GH_TOKEN"])) throw Error("GH_TOKEN Environment Variable Not Found");

    const scope = JSON.parse(await FS.promises.readFile(Path.join(process.cwd(), "package.json"), { encoding: "utf-8" })).name.split("/")[0];

    const configuration = [
        [
            [ scope, "registry" ].join(":"),
            "https://npm.pkg.github.com"
        ].join("="),
        [ "//npm.pkg.github.com/:_authToken", Token.value ].join("=")
    ].join("\n");

    try {
        Subprocess.spawnSync("npx", [ "--yes", "lerna@latest", "version", "--yes", "--conventional-commits", "--create-release", "github" ], {
            shell: false,
            env: process.env,
            cwd: process.cwd(),
            stdio: "inherit",
            encoding: "utf-8"
        });
    } catch (exception) {
        /*** Continue */
    }

    await FS.promises.writeFile(".npmrc", configuration, "utf-8");

    Subprocess.spawnSync("npx", [ "--yes", "lerna@latest", "publish", "--yes", "--registry", "https://npm.pkg.github.com", "from-git", "--canary" ], {
        shell: false,
        env: process.env,
        cwd: process.cwd(),
        stdio: "inherit",
        encoding: "utf-8"
    });

    await FS.promises.rm(".npmrc", {
        force: true,
        recursive: false
    });

    try {
        Subprocess.spawnSync("git", [ "push" ], {
            shell: false,
            env: process.env,
            cwd: process.cwd(),
            stdio: "inherit",
            encoding: "utf-8"
        });
    } catch (exception) {
        /*** Continue */
    }

    process.exit(0);
})();