import type { WithId, Document } from "mongodb";

export interface User {
    id: string;
    avatar: string;
    description: string;
    email: string;
    username: string;
    password: string;
    rotation: Date;
    comment: string[],
    login: {
        date: Date | null,
        expiration: Date | null,
        origin: string
    };
    role: number;
    entitlements: string[];
    creation: Date;
    modification: Date;
    name: string;
    version: string;
}