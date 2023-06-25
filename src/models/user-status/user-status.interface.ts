import { UserStatus } from "@/gql/graphql";

export interface IUserStatus {
  get status(): UserStatus;

  get label(): string;

  get description(): string;
}
