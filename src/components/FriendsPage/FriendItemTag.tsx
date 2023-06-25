import UserAvatar from "@/components/shared/UserAvatar";
import { FriendFragment, FriendRequestFragment, FriendRequestStatus } from "@/gql/graphql";
import { userStatusFactory } from "@/models/user-status/user-status.factory";

type Props = {
  friend?: FriendFragment;
  friendRequest?: FriendRequestFragment;
};

const friendRequestMap: Record<FriendRequestStatus, string> = {
  RECEIVED: "Demande d'ami reçue",
  SENT: "Demande d'ami envoyée",
};

const FriendItemTag = ({ friend, friendRequest }: Props) => {
  const userStatusModel = userStatusFactory(friend?.status ?? "INVISIBLE");
  return (
    <div className="flex overflow-hidden">
      <UserAvatar avatarColor={friend?.avatarColor ?? friendRequest?.avatarColor} status={friend?.status} className="mr-3 w-8 h-8 shrink-0" />
      <div className="flex flex-col overflow-hidden">
        <div className="flex overflow-hidden grow items-end justify-start leading-[1.1]">
          <span className="whitespace-nowrap overflow-hidden font-semibold block flex-initial text-white">{(friend ?? friendRequest)?.username}</span>
          <span className="text-h-secondary invisible text-sm leading-4 group-hover:visible">#{(friend ?? friendRequest)?.discriminator}</span>
        </div>
        <div className="text-h-secondary">
          <div className="whitespace-nowrap overflow-hidden text-btw-sm-xs font-medium">
            {friend ? userStatusModel.label : friendRequest && friendRequestMap[friendRequest?.requestStatus]}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendItemTag;
