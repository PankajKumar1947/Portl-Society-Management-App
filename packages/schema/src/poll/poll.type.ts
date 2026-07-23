import z from "zod";
import {
  pollSchema,
  createPollSchema,
  updatePollSchema,
  pollOptionSchema,
  createPollOptionSchema,
} from "./poll.schema";
import { ApiResponse } from "../shared/api.type";
import { User } from "../user/user.type";

export type PollData = z.infer<typeof pollSchema> & {
  publisher?: User;
  options?: PollOptionData[];
};

export type PollOptionData = z.infer<typeof pollOptionSchema>;

export type CreatePollBody = z.infer<typeof createPollSchema>;
export type UpdatePollBody = z.infer<typeof updatePollSchema>;
export type CreatePollOptionBody = z.infer<typeof createPollOptionSchema>;

export type PollResponse = ApiResponse<PollData>;
export type PollListResponse = ApiResponse<PollData[]>;

export interface CastVoteBody {
  optionId: string;
}

export interface VoteData {
  voteId: string;
  pollId: string;
  optionId: string;
  userId: string;
  societyId: string;
  votedAt: string;
}

export interface PollResultsData {
  pollId: string;
  totalVotes: number;
  options: {
    optionId: string;
    label: string;
    votes: number;
    percentage: number;
  }[];
  userVotedOptionId?: string;
}
