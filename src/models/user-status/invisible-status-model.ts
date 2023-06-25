import { UserStatus } from "@/gql/graphql";
import { IUserStatus } from "@/models/user-status/user-status.interface";

export class InvisibleStatusModel implements IUserStatus {
  public get status(): UserStatus {
    return "INVISIBLE";
  }

  public get label(): string {
    return "Invisible";
  }

  public get description(): string {
    return "Tu n'apparaîtras pas connecté, mais tu auras néanmoins accès à toutes les fonctionnalités de Discord.";
  }
}
