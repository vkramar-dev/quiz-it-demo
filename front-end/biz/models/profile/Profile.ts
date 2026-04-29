import { Attempt } from "./Attempt";
import { PerformanceByTopic } from "./PerformanceByTopic";
import { ProfileSummary } from "./ProfileSummary";

export interface Profile {
    profileSummary: ProfileSummary;
    topics: PerformanceByTopic[];
    attempts: Attempt[];
}