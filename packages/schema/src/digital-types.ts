import OS from "os";

export module Digital {
    export type Units = Readonly<{
        bytes: 1.024 | number,
        kb: 1.024e3 | number,
        mb: 1.024e6 | number,
        gb: 1.024e9 | number
    }>;

    export type Unit = keyof Units;

    export type Measurement = "total" | "runtime" | "rss";

    export type Internal = {
        /*** Total V8's Runtime Memory Usage */
        total: { [$ in Unit]: number },
        /*** V8's Point-in-Time Runtime Memory Usage */
        runtime: { [$ in Unit]: number },
        /*** C++ and JavaScript objects and code Runtime Memory Usage */
        rss: { [$ in Unit]: number }
    }

    export type V8 = {
        v8: Internal
    }

    export type System = V8 & {
        system: {
            total: { [$ in Unit]: number },
            runtime: { [$ in Unit]: number },
            available: { [$ in Unit]: number }
        }
    }

    export type Memory = {
        [$ in Measurement]: number
    }

    /// 1 << 10 === 1024;
    export const Constants = { bytes: 1.000, kb: ( 1 << 10 ) * 1e0, mb: ( 1 << 10 ) * 1e3, gb: ( 1 << 10 ) * 1e6 } as const;
    export const ram = (): Digital.System => {
        const total = OS.totalmem();
        const available = OS.freemem();
        const delta = total - available;

        const runtime = process.memoryUsage();

        return {
            v8:     {
                rss:        {
                    bytes: runtime.rss / Constants.bytes,
                    kb:    runtime.rss / Constants.kb,
                    mb:    runtime.rss / Constants.mb,
                    gb:    runtime.rss / Constants.gb
                }, runtime: {
                    bytes: runtime.heapUsed / Constants.bytes,
                    kb:    runtime.heapUsed / Constants.kb,
                    mb:    runtime.heapUsed / Constants.mb,
                    gb:    runtime.heapUsed / Constants.gb
                }, total:   {
                    bytes: runtime.heapTotal / Constants.bytes,
                    kb:    runtime.heapTotal / Constants.kb,
                    mb:    runtime.heapTotal / Constants.mb,
                    gb:    runtime.heapTotal / Constants.gb
                }
            },
            system: {
                runtime:      {
                    bytes: delta / Constants.bytes,
                    kb:    delta / Constants.kb,
                    mb:    delta / Constants.mb,
                    gb:    delta / Constants.gb
                }, available: {
                    bytes: available / Constants.bytes,
                    kb:    available / Constants.kb,
                    mb:    available / Constants.mb,
                    gb:    available / Constants.gb
                }, total:     {
                    bytes: total / Constants.bytes,
                    kb:    total / Constants.kb,
                    mb:    total / Constants.mb,
                    gb:    total / Constants.gb
                }
            }
        };
    }
}

export default Digital;