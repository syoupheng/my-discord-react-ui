import { UserStatus } from "@/gql/graphql";
import { IUserStatus } from "@/models/user-status/user-status.interface";

export class OnlineStatusModel implements IUserStatus {
  public get status(): UserStatus {
    return "ONLINE";
  }

  public get label(): string {
    return "En ligne";
  }

  public get description(): string {
    return "";
  }
}
