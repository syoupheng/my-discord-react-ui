import UserProfileCard from "@/components/UserPopover/UserProfileCard";
import { AuthUser } from "@/gql/graphql";
import { render, screen, userEvent, within } from "@/tests/test-utils";
import { Mock } from "vitest";

const authUserInfo = {
  id: 1,
  username: "username",
  email: "email@gmail.com",
  discriminator: "1234",
  avatarColor: "red",
  status: "ONLINE",
  createdAt: "2021-09-01T00:00:00.000Z",
  friendRequests: [],
  friends: [],
  privateConversations: [],
  privateGroups: [],
  newMessagesNotifications: [],
} satisfies AuthUser;

let onClose: Mock;

describe("UserProfileCard - functional component", () => {
  beforeEach(() => {
    onClose = vi.fn();
    render(<UserProfileCard {...authUserInfo} closePopover={onClose} />);
  });

  it("should display the user status selection when hovering the user status", async () => {
    expect(screen.queryByTestId("user-status-list")).not.toBeInTheDocument();
    await userEvent.hover(screen.getByTestId("user-status-selection"));
    expect(screen.getByTestId("user-status-list")).toBeInTheDocument();
  });

  it("should close the popover when clicking on the user status selection", async () => {
    await userEvent.hover(screen.getByTestId("user-status-selection"));
    const userStatusList = screen.getByTestId("user-status-list");
    expect(userStatusList).toBeInTheDocument();
    await userEvent.click(within(userStatusList).getByText(/Invisible/i));
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(screen.queryByTestId("user-status-list")).not.toBeInTheDocument();
  });
});
