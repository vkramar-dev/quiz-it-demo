import { AttemptDto } from "./AttemptDto";
import { PerformanceByTopicDto } from "./PerformanceByTopicDto";
import { ProfileSummaryDto } from "./ProfileSummaryDto";

export interface ProfileDto {
    profileSummary: ProfileSummaryDto;
    topics: PerformanceByTopicDto[];
    attempts: AttemptDto[];
}