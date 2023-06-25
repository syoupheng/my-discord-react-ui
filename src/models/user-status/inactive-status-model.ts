import { UserStatus } from "@/gql/graphql";
import { IUserStatus } from "@/models/user-status/user-status.interface";

export class InactiveStatusModel implements IUserStatus {
  get status(): UserStatus {
    return "INACTIVE";
  }
  get label(): string {
    return "Inactif";
  }
  get description(): string {
    return "";
  }
}
