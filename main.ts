import "dotenv/config";

import Dot from "dotenv";
import Expansion from "dotenv-expand";

export const Hydrate = () => {
    Expansion.expand( Dot.config() ).parsed;

    return true;
};

export const Runtime = async () => {
    Hydrate();

    const { Initialize } = await import("@iac-factory/api-authentication-core");

    (process.env["NODE_ENV"] !== "testing") && await Initialize();
};

export default Runtime;
