import type { User } from ".";

import { genSalt, hash } from "bcryptjs";

export async function Hash(user: User) {
    const salt = await genSalt(5);
    const password = await hash(user.password, salt);

    user.password = password;
}

export default Hash;