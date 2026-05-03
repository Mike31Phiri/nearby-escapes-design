"use client";
import BookingPage from "@/views/booking/BookingPage";

export default function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  return <BookingPage searchParams={searchParams} />;
}
