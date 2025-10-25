import { User } from "./user";

export interface Comment {
    id: number,
    message: string,
    date: string,
    userId: number,
    postId?: number,
    User: User
}