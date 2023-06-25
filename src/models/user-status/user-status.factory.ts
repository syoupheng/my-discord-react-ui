import { UserStatus } from "@/gql/graphql";
import { DoNotDisturbStatusModel } from "@/models/user-status/do-not-disturb-model";
import { InactiveStatusModel } from "@/models/user-status/inactive-status-model";
import { InvisibleStatusModel } from "@/models/user-status/invisible-status-model";
import { OnlineStatusModel } from "@/models/user-status/online-status-model";
import { IUserStatus } from "@/models/user-status/user-status.interface";

export function userStatusFactory(status: UserStatus): IUserStatus {
  switch (status) {
    case "INVISIBLE":
      return new InvisibleStatusModel();
    case "ONLINE":
      return new OnlineStatusModel();
    case "INACTIVE":
      return new InactiveStatusModel();
    case "DO_NOT_DISTURB":
      return new DoNotDisturbStatusModel();
    default:
      throw new Error("Invalid user status");
  }
}
