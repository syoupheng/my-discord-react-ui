import dayjs from "dayjs";
import locale from "dayjs/locale/fr";
import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(localizedFormat);
dayjs.locale(locale);

export const formatToDayMonthYear = (isoDate: string) => dayjs(isoDate).format("D MMMM YYYY");

export const isYesterday = (isoDate: string): boolean => {
  const date = dayjs(isoDate);
  const timeToNow = dayjs().diff(date, "day");
  if (timeToNow >= 2) return false;
  const today = dayjs().day();
  if (date.day() === today - 1 || (today === 0 && date.day() === 6)) return true;
  return false;
};

export const formatMessageDate = (isoDate: string) => {
  const creationDate = dayjs(isoDate);
  let formattedDate = creationDate.format("DD/MM/YYYY HH:mm");
  const timeToNow = dayjs().diff(dayjs(isoDate), "day");
  if (timeToNow < 1 && dayjs().day() === creationDate.day()) {
    formattedDate = `Aujourd'hui à ${creationDate.format("HH:mm")}`;
  } else if (isYesterday(isoDate)) formattedDate = `Hier à ${creationDate.format("HH:mm")}`;
  return formattedDate;
};

export const formatOldestNewMessageDate = (isoDate: string) => {
  const creationDate = dayjs(isoDate);
  let formattedDate = `le ${creationDate.format("dddd D MMMM")} à ${creationDate.format("HH:mm")}`;
  const timeToNow = dayjs().diff(dayjs(isoDate), "day");
  if (timeToNow < 1 && dayjs().day() === creationDate.day()) {
    formattedDate = creationDate.format("HH:mm");
  } else if (isYesterday(isoDate)) formattedDate = `hier à ${creationDate.format("HH:mm")}`;
  return formattedDate;
};

export const formatUserSubscribeDate = (isoDate: string) => dayjs(isoDate).format("ll");

export const getMinutesDiff = (date1: string, date2: string) => dayjs(date1).diff(date2, "minute");

type MessageInfo = {
  createdAt: string;
  authorId: number;
};

export const isMessageConsecutive = (currentMessage: MessageInfo, previousMessage: MessageInfo): boolean => {
  if (!previousMessage) return false;
  const { authorId, createdAt } = currentMessage;
  const { authorId: previousAuthorId, createdAt: previousPubDate } = previousMessage;
  return previousAuthorId === authorId && getMinutesDiff(createdAt, previousPubDate) < 2;
};

export const formatTimestamp = (isoDate: string) => dayjs(isoDate).format("HH:mm");

export const getMillisecondsDiff = (date1: string, date2: string) => dayjs(date1).diff(date2);
