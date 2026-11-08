/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useState, useEffect } from "react";

export function LocalTime({ date }: { date: Date | string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show a blank space or loading skeleton during server render to prevent hydration errors
  if (!mounted) return <span className="opacity-0">00:00 AM</span>;

  return (
    <>{new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</>
  );
}