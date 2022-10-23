import type { User } from ".";

export async function Dates(user: User) {
    user.creation = new Date();
    user.modification = new Date();
}

export default Dates;