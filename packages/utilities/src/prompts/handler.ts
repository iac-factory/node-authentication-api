/***
 * User-Input Handler
 * ---
 *
 * @experimental
 * @constructor
 *
 */
export const Handler = async (cursor?: boolean) => {
    process?.on("exit", async (code = 0) => {
        await clear();

        process?.exit(code ? code : 0);
    });

    ( cursor ) || process?.stdout?.write("\u001B[?25l" + "\r");

    process?.stdin?.setRawMode(true);

    process?.stdin?.on("open", () => {
        process?.stdin?.on("timeout", () => {
            console.debug("[Debug] Standard-Input Timeout Event Trigger");
        });
    });

    const clear = async (wipe?: boolean) => {
        const [ X, Y ] = process?.stdout?.getWindowSize();

        const buffer = " ".repeat(process?.stdout?.columns) ?? null;

        process?.stdout?.cursorTo(0, Y);
        process?.stdout?.clearLine(0);

        process?.stdout?.write(buffer);

        process?.stdout?.cursorTo(0, process?.stdout?.rows);
        process?.stdout?.write("\u001B[?25h");

        process?.stdout?.emit("drain");

        ( wipe ) && process?.stdout?.cursorTo(0, 0);
        ( wipe ) && process?.stdout?.clearScreenDown();
    };

    process?.stdin?.on("data", async ($) => {
        /// Exit if User Inputs := CTRL + C
        Buffer.from([ 0x3 ]).equals($) && process?.exit(0);

        /// Exit if User Inputs := CTRL + D
        Buffer.from([ 0x4 ]).equals($) && process?.exit(0);

        /// Exit if User Inputs := CTRL + Z
        Buffer.from([ 0x1a ]).equals($) && process?.exit(0);
    });

    process?.on("exit", async (code = 0) => {
        await clear();

        process?.exit(code ? code : 0);
    });

    await clear(true);
};

export default Handler;