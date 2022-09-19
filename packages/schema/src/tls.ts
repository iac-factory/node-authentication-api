export module TLS {
    export type Global = {
        "global-bundle": string;
    }

    export type Regional = {
        "rds-ca-2019.us-east-2": string;
    }

    export type Combined = {
        "rds-combined-ca-bundle": string;
    }

    export type Bundle = {
        "rds-combined-ca-bundle": string;
    }

    export type CA = {
        "global-bundle": string;
        "rds-ca-2019.us-east-2": string;
        "rds-combined-ca-bundle": string;
        "us-east-2-bundle": string;
    }
}
