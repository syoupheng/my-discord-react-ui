import { filterEmptyFields } from "@/utils/form";
import { z } from "zod";

describe("filterEmptyFields - form utility function", () => {
  it("should return an object with only non-empty fields", () => {
    const formData = {
      email: "john@gmail.com",
      password: "password",
      firstName: null,
      lastName: "",
    };

    const zodSchema = z.object({
      email: z.string().email(),
      password: z.string(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
    });

    expect(filterEmptyFields(formData, zodSchema)).toEqual({
      password: "password",
      email: "john@gmail.com",
    });
  });
});
