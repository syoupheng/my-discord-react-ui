import { formatMessageDate, formatOldestNewMessageDate, isMessageConsecutive, isYesterday } from "@/utils/dates";

describe("isYesterday - dates utils", () => {
  const currentDate = new Date();

  it("should return false if date is today", () => {
    const today = new Date();
    expect(isYesterday(today.toISOString())).toBe(false);
  });

  it("should return false if date is more than 2 days ago", () => {
    const yesterday = new Date(currentDate);
    yesterday.setDate(currentDate.getDate() - 2);
    expect(isYesterday(yesterday.toISOString())).toBe(false);
  });

  it("should return true if date is yesterday", () => {
    // Calculate the date from yesterday
    const yesterday = new Date(currentDate);
    yesterday.setDate(currentDate.getDate() - 1);
    expect(isYesterday(yesterday.toISOString())).toBe(true);
  });
});

describe("formatMessageDate - dates utils", () => {
  const currentDate = new Date();

  it("should return 'Aujourd'hui à ...' if date is today", () => {
    const today = new Date();
    expect(formatMessageDate(today.toISOString()).startsWith("Aujourd'hui à")).toBe(true);
  });

  it("should return 'Hier à ...' if date is yesterday", () => {
    // Calculate the date from yesterday
    const yesterday = new Date(currentDate);
    yesterday.setDate(currentDate.getDate() - 1);
    expect(formatMessageDate(yesterday.toISOString()).startsWith("Hier à")).toBe(true);
  });

  it("should return 'DD/MM/YYYY HH:mm' if date is more than 2 days ago", () => {
    const date = new Date(currentDate);
    date.setDate(currentDate.getDate() - 2);
    expect(formatMessageDate(date.toISOString())).toMatch(/^(0[1-9]|[1-2][0-9]|3[0-1])\/(0[1-9]|1[0-2])\/\d{4} (0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/);
  });
});

describe("formatOldestNewMessageDate - dates utils", () => {
  const currentDate = new Date();

  it("should return 'HH:mm' if date is today", () => {
    const today = new Date();
    expect(formatOldestNewMessageDate(today.toISOString())).toMatch(/^(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/);
  });

  it("should return 'hier à ...' if date is yesterday", () => {
    // Calculate the date from yesterday
    const yesterday = new Date(currentDate);
    yesterday.setDate(currentDate.getDate() - 1);
    expect(formatOldestNewMessageDate(yesterday.toISOString()).startsWith("hier à")).toBe(true);
  });

  it("should return 'le ... à ...' if date is more than 2 days ago", () => {
    const date = new Date("2023-04-08");
    expect(formatOldestNewMessageDate(date.toISOString()).startsWith("le samedi 8 avril à ")).toBe(true);
  });
});

describe("isMessageConsecutive - dates utils", () => {
  it("should return true if messages are from the same author and less than 2 minutes apart", () => {
    const currentMessage = { authorId: 1, createdAt: new Date().toISOString() };
    const previousMessage = { authorId: 1, createdAt: new Date().toISOString() };
    expect(isMessageConsecutive(currentMessage, previousMessage)).toBe(true);
  });

  it("should return false if messages are from different authors", () => {
    const currentMessage = { authorId: 1, createdAt: new Date().toISOString() };
    const previousMessage = { authorId: 2, createdAt: new Date().toISOString() };
    expect(isMessageConsecutive(currentMessage, previousMessage)).toBe(false);
  });

  it("should return false if messages are more than 2 minutes apart", () => {
    const currentMessage = { authorId: 1, createdAt: new Date().toISOString() };
    const previousMessage = { authorId: 1, createdAt: new Date().toISOString() };
    previousMessage.createdAt = new Date(previousMessage.createdAt).setMinutes(new Date(previousMessage.createdAt).getMinutes() - 3).toString();
    expect(isMessageConsecutive(currentMessage, previousMessage)).toBe(false);
  });
});
