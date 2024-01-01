import FriendsSearchbar from "@/components/FriendsPage/FriendsSearchbar";
import FriendsTabProvider from "@/providers/FriendsTabProvider";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

let handleChange: (search: string) => void;

describe("FriendsSearchbar - functional component", () => {
  beforeEach(() => {
    handleChange = vi.fn();
  });

  it("should render correctly", () => {
    render(
      <FriendsTabProvider>
        <FriendsSearchbar search="" handleChange={handleChange} />
      </FriendsTabProvider>
    );
    const textBox = screen.getByPlaceholderText("Rechercher");
    expect(textBox).toBeInTheDocument();
    expect(textBox).toHaveValue("");
  });

  it("should render correctly with search value", () => {
    render(
      <FriendsTabProvider>
        <FriendsSearchbar search="search" handleChange={handleChange} />
      </FriendsTabProvider>
    );
    const textBox = screen.getByPlaceholderText("Rechercher");
    expect(textBox).toBeInTheDocument();
    expect(textBox).toHaveValue("search");
  });

  it("should render correctly with search value and clear icon", () => {
    render(
      <FriendsTabProvider>
        <FriendsSearchbar search="search" handleChange={handleChange} />
      </FriendsTabProvider>
    );
    const textBox = screen.getByPlaceholderText("Rechercher");
    expect(textBox).toBeInTheDocument();
    expect(textBox).toHaveValue("search");
    expect(screen.getByRole("button", { name: "Effacer la recherche" })).toBeInTheDocument();
  });

  it("should call the handleChange function when clicking on clear icon", async () => {
    render(
      <FriendsTabProvider>
        <FriendsSearchbar search="search" handleChange={handleChange} />
      </FriendsTabProvider>
    );

    const textBox = screen.getByPlaceholderText("Rechercher");
    expect(textBox).toBeInTheDocument();
    expect(textBox).toHaveValue("search");

    const clearButton = screen.getByRole("button", { name: "Effacer la recherche" });
    expect(clearButton).toBeInTheDocument();

    await userEvent.click(clearButton);
    expect(handleChange).toHaveBeenCalledOnce();
    expect(handleChange).toHaveBeenCalledWith("");
  });

  it("should call handleChange when typing in search input", async () => {
    render(
      <FriendsTabProvider>
        <FriendsSearchbar search="" handleChange={handleChange} />
      </FriendsTabProvider>
    );

    const textBox = screen.getByPlaceholderText("Rechercher");
    expect(textBox).toBeInTheDocument();
    expect(textBox).toHaveValue("");

    await userEvent.type(textBox, "search");
    expect(handleChange).toHaveBeenCalledTimes(6);
  });
});
