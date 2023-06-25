import { UserStatus } from "@/gql/graphql";
import { IUserStatus } from "@/models/user-status/user-status.interface";

export class DoNotDisturbStatusModel implements IUserStatus {
  public get status(): UserStatus {
    return "DO_NOT_DISTURB";
  }

  public get label(): string {
    return "Ne pas déranger";
  }

  public get description(): string {
    return "Tu ne recevras aucune notification sur le bureau.";
  }
}
