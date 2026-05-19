import { notFound } from "next/navigation";
import { DayDetail } from "@/components/trades/day-detail";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export default async function TradeDetailPage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;
  if (!DATE_RE.test(date)) notFound();
  return <DayDetail date={date} />;
}
