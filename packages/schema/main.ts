export * from "./src";

export type Helper<Type> = Type extends "string" ? string : (
    Type extends "number" ? number : (
        Type extends "integer" ? number : (
            Type extends "object" ? object : (
                Type extends "array" ? any[] : (
                    Type extends "boolean" ? boolean : (
                        Type extends "null" ? null : (
                            any
                            )
                        )
                    )
                )
            )
        )
    );

export type Extractor<Generic> = Generic extends { type: string, properties: object } ? { [$ in keyof Generic["properties"]]: Extractor<Generic["properties"][$]> } : Generic extends { type: string } ? Helper<Generic["type"]> : any;
