import { graphql, HttpResponse } from "msw";

export const handlers = [
  graphql.mutation("editProfile", () => {
    return HttpResponse.json({
      data: {
        editProfile: {
          id: 10747,
          username: "test4",
          status: "DO_NOT_DISTURB",
          phoneNumber: null,
          __typename: "AuthUser",
        },
      },
    });
  }),
];
