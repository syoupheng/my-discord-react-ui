import MentionOptionItem from "@/components/ChatSection/MentionOptionItem";
import { ChannelMemberFragment } from "@/gql/graphql";
import useAuthUserCache from "@/hooks/auth/useAuthUserCache";
import { Descendant } from "slate";

type Props = {
  mentionSearch: string;
  mentions: ChannelMemberFragment[];
  arrowPosition: number;
  slateValue: Descendant[];
}

const MentionsAutocomplete = ({ mentionSearch, mentions, arrowPosition, slateValue }: Props) => {
  const authUser = useAuthUserCache();
  if (mentions.length === 0) return null;
  return (
    <div
      tabIndex={0}
      className="bg-secondary absolute left-0 right-0 rounded-[5px] overflow-hidden shadow-[0_0_0_1px_rgba(5,5,6,0.15)] whitespace-nowrap text-ellipsis z-10 pb-0"
      style={{ bottom: `${8 + (1 + slateValue.length) * 22}px` }}
    >
      <div className="overflow-x-hidden overflow-y-scroll max-h-[490px] pr-0 pb-2 flex flex-col relative min-h-0 small-scroll-container">
        <div className="rounded-[3px] p-2 pr-0">
          <h3 className="uppercase py-1 text-h-secondary text-xs font-semibold">
            {mentionSearch.length > 0 ? (
              <>
                Membre(s) correspondant à <strong className="text-white normal-case">@{mentionSearch}</strong>
              </>
            ) : (
              "Membres"
            )}
          </h3>
        </div>
        {mentions.map((mention, idx) => (
          <MentionOptionItem active={arrowPosition === idx} key={mention.id} mention={mention} authUser={authUser} mentionSearch={mentionSearch} />
        ))}
      </div>
    </div>
  );
};

export default MentionsAutocomplete;
