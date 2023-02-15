"use client";
import { useEffect, useState } from "react";
import { format } from "date-fns";

const useCurrentTime = () => {
  const [time, setTime] = useState<string>("00:00");
  useEffect(() => {
    const timer = setInterval(() => {
      const currentTime = new Date();
      setTime(format(currentTime, "hh:mm"));
    }, 500);
    return () => {
      clearInterval(timer);
    };
  }, []);
  return {
    time,
  };
};

export { useCurrentTime };
