import { AuthUserSubscriptionParams } from "@/components/PrivateApp";
import { graphql } from "@/gql";
import { useEffect } from "react";

const CONFIRM_FRIEND_REQUEST_SUBSCRIPTION = graphql(`
  subscription OnFriendRequestConfirmed($userId: Int!) {
    friendRequestConfirmed(userId: $userId) {
      newFriend {
        ...Friend
      }
      newConversation {
        ...PrivateConversation
      }
    }
  }
`);

const useFriendConfirmedSub = ({ authUserId, subscribeToMore }: AuthUserSubscriptionParams) => {
  useEffect(() => {
    let unsubscribe: () => void;
    unsubscribe = subscribeToMore({
      document: CONFIRM_FRIEND_REQUEST_SUBSCRIPTION,
      variables: { userId: authUserId },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const { newFriend, newConversation } = subscriptionData.data.friendRequestConfirmed;
        const newFriendRequests = prev.me.friendRequests.filter((request) => request.id !== newFriend.id);
        const newData = {
          ...prev.me,
          friends: prev.me.friends.some((friend) => friend.id === newFriend.id) ? prev.me.friends : [newFriend, ...prev.me.friends],
          friendRequests: newFriendRequests,
          privateConversations: prev.me.privateConversations.some((conv) => conv.id === newConversation.id)
            ? prev.me.privateConversations
            : [newConversation, ...prev.me.privateConversations],
        };

        return { me: newData };
      },
    });

    return () => !!unsubscribe && unsubscribe();
  }, []);
};

export default useFriendConfirmedSub;
