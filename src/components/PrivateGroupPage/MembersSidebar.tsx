import GroupMemberItem from "@/components/PrivateGroupPage/GroupMemberItem";
import { ChannelMemberFragment } from "@/gql/graphql";
import useIsMembersOpen from "@/hooks/private-groups/useIsMembersOpen";
import { Transition } from "@headlessui/react";

type Props = {
  members: ChannelMemberFragment[];
};

const MembersSidebar = ({ members }: Props) => {
  const [isMembersOpen] = useIsMembersOpen();
  return (
    <Transition
      appear={true}
      className="relative max-h-full flex w-60"
      show={isMembersOpen}
      enter="transition-width ease-in-out duration-500"
      enterFrom="w-0"
      enterTo="w-60"
      leave="transition-width ease-in-out duration-500"
      leaveFrom="w-60"
      leaveTo="w-0"
    >
      <div className="overflow-x-hidden overflow-y-scroll pr-0 bg-secondary w-60 pb-5 grow-0 shrink-0 basis-auto h-auto min-h-0 small-scroll-container absolute inset-0">
        <h2 className="pt-6 pr-2 pl-4 h-10 text-ellipsis whitespace-nowrap overflow-hidden uppercase text-xs font-medium text-channels-default">
          Membres-{members.length}
        </h2>
        {members.map((member) => (
          <GroupMemberItem key={member.id} member={member} />
        ))}
      </div>
    </Transition>
  );
};

export default MembersSidebar;
