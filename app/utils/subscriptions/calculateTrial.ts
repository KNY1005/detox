import { addMonths, isBefore, isEqual, parseISO } from "date-fns";

export default function calculateTrial(createdAt: string, trialMonths: number) {
  const today = new Date();
  const dateOnly = createdAt.split("T")[0];
  const createdAtDate = parseISO(dateOnly);
  const trialEndDate = addMonths(createdAtDate, trialMonths);
  return isBefore(today, trialEndDate) || isEqual(today, trialEndDate);
}
