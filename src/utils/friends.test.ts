import { FriendFragment } from "@/gql/graphql";
import { filterFriendsByTab } from "@/utils/friends";

const friends = [
  {
    id: 1,
    username: "Bob",
    status: "ONLINE",
    discriminator: "1234",
    avatarColor: "#000000",
  },
  {
    id: 2,
    username: "Alice",
    status: "INACTIVE",
    discriminator: "5678",
    avatarColor: "#ffffff",
  },
  {
    id: 3,
    username: "Eve",
    status: "INVISIBLE",
    discriminator: "9012",
    avatarColor: "#000000",
  },
] satisfies FriendFragment[];

describe("filterFriendsByTab - utility function", () => {
  it("should return all friends if selected tab is ALL", () => {
    expect(filterFriendsByTab(friends, "ALL")).toEqual(friends);
  });

  it("should return only online friends if selected tab is ONLINE", () => {
    expect(filterFriendsByTab(friends, "ONLINE")).toEqual([friends[0], friends[1]]);
  });
});
