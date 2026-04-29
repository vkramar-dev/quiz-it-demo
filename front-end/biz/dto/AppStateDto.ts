import { TopicDto } from "./TopicDto";
import { UserDto } from "./UserDto";

export interface AppStateDto {
    topics: TopicDto[];
    user: UserDto | null;
}