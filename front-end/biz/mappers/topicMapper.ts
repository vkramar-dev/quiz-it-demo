import { TopicDto } from "../dto/TopicDto";
import { Topic } from "../models/Topic";


const defaultIcon = "code";

const topicMeta: Record<string, string> = {
    "javascript": "javascript",
    "c#": "csharp",
    "react": "react",
    "c/c++": "cpp",
    "sql": "database",
    ".net": "dotnet",
    "english grammar": "language",
};

function normalizeKey(name: string): string {
    return name.trim().toLowerCase();
}

export function mapTopic(dto: TopicDto): Topic {
    const meta = topicMeta[normalizeKey(dto.name)] ?? defaultIcon;

    return {
        ...dto,
        icon: meta,
    };
}

// export function mapTopicNameToColor(name: string): string {
//     const meta = topicMeta[normalizeKey(name)] ?? defaultMeta.color;
//     return meta.color;
// }