import UserAvatar from "@/components/shared/UserAvatar";
import { UserStatus } from "@/gql/graphql";
import { userStatusFactory } from "@/models/user-status/user-status.factory";

type Props = {
  avatarColor: string;
  status: UserStatus;
  username: string;
  discriminator: string;
};

const UserPopoverButton = ({ avatarColor, status, username, discriminator }: Props) => {
  const userStatusModel = userStatusFactory(status);
  return (
    <>
      <UserAvatar avatarColor={avatarColor} status={status} className="mr-2" />
      <div className="whitespace-nowrap overflow-hidden text-btw-sm-xs">
        <div className="text-white font-bold overflow-hidden text-ellipsis text-left">{username}</div>
        <div className="text-h-secondary text-left overflow-hidden max-h-[18px]">
          <div className="transition-transform duration-300 group-hover:-translate-y-1/2 text-xs">
            <div>{userStatusModel.label}</div>
            <div>#{discriminator}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserPopoverButton;
