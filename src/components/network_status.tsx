"use client";

import React, { useState, useEffect } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function NetworkStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(false);
  const [scale, setScale] = useState<boolean>(false);
  const [width, setWidth] = useState<string>("w-[300px]");
  const [display, setDisplay] = useState(true);

  const checkInternet = async () => {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/todos/1",
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setIsOnline(response.ok);
    } catch {
      setIsOnline(false);
    }
  };

  const Notification = () => {
    setDisplay(true);

    const sca = setTimeout(() => {
      setScale(true);
      setWidth("w-[300px]");
    }, 100);

    const scaler = setTimeout(() => {
      setScale(false);
      setWidth("w-[40px]");
    }, 5000);

    const display = setTimeout(() => {
      if (isOnline) setDisplay(false);
    }, 5150);

    return () => {
      clearTimeout(scaler);
      clearTimeout(display);
      clearTimeout(sca);
    };
  };

  useEffect(() => {
    Notification();
  }, [isOnline]);

  useEffect(() => {
    checkInternet();
    const interval = setInterval(checkInternet, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`z-[999]  items-center justify-center fixed bottom-0 left-0 w-full p-5 ${
        display ? "flex flex-row" : "hidden"
      }`}
    >
      <div
        className={`transition-all duration-550 ease-in-out rounded-full h-[40px] ${width} bg-[#1d1d1d] flex justify-center items-center p-2 overflow-hidden`}
      >
        {scale ? (
          <p className="text-sm text-[#808080]">
            {isOnline ? "You are online 🎉" : "You are offline 😞"}
          </p>
        ) : (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                {" "}
                <p className="text-sm text-[#808080]">
                  {isOnline ? "🎉" : "😞"}
                </p>
              </TooltipTrigger>
              <TooltipContent className="bg-white text-black">
                <p>
                  {isOnline ? (
                    <span>
                      you are <b>online</b>
                    </span>
                  ) : (
                    <span>
                      you are <b>offline</b>
                    </span>
                  )}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
}
