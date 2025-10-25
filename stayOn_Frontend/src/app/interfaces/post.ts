import { Comment } from "./comment";
import { Material } from "./material";
import { Topic } from "./topic";
import { User } from "./user";

export interface Post {
    id: number,
    message: string,
    date: string,
    userId: number,
    User: User,
    Comments: Comment[],
    Materials: Material[],
    Topic: Topic
}

export interface PostUpdate {
    message: string,
    date: string,
    topicId: number,
}

