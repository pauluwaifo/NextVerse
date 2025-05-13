"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Wind,
  Droplet,
  SunSnow,
  WindArrowDown,
  Eye,
  Cloudy,
  CloudSunRain,
  CloudRain,
  LoaderCircle,
} from "lucide-react";

function Weather() {
  const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
  const [city, setCity] = useState<string>("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const temp = Math.floor(data?.main?.temp);

  const getWeather = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (city.length > 1) {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=imperial`
        );
        const data = await response.json();
        setData(data);
      } catch (err) {
        const response = {
          message: "failed to fetch weather details",
          error: err instanceof Error ? err.message : String(err),
        };
        console.log(response);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="relative overflow-hidden shadow-xl bg-[#2f2f2f]/20 rounded-xl h-[300px] md:w-[300px] sm:w-screen">
      {data && data.cod !== "404" ? (
        <div className="flex flex-col p-2">
          {/* loader */}
          {loading && (
            <div className="z-10 backdrop-blur-sm bg-white/5 absolute top-0 left-0 flex flex-col flex-1 h-full w-full items-center justify-center gap-5">
              <div className="flex items-center justify-center flex-row gap-5">
                <Cloudy /> <CloudSunRain /> <CloudRain />
              </div>
              <p
                className={`text-sm text-[#808080] ${
                  loading && "animate-spin"
                }`}
              >
                <LoaderCircle />
              </p>
            </div>
          )}
          {/* section 1 */}
          <div className="flex flex-row justify-between items-center">
            <div className=" flex flex-row items-center gap-2">
              <p className="text-sm p-1 bg-yellow-200/20 text-yellow-500 rounded-xl">
                Country
              </p>
              <p className="text-sm">{data?.sys?.country}</p>
            </div>
            <div className=" flex flex-row items-center gap-2">
              <p className="text-sm p-1 bg-green-200/20 text-green-500 rounded-xl">
                City
              </p>
              <p className="text-sm">{data?.name}</p>
            </div>
          </div>
          {/* section 2 */}
          <div className="flex flex-row gap-2 items-center">
            <Image
              alt="icon"
              src={`https://openweathermap.org/img/wn/${data?.weather[0]?.icon}@2x.png`}
              width={100}
              height={100}
              priority
            />
            <div>
              <p className="text-4xl">
                <span className="font-bold">{temp}</span>
                <sup className="text-sm">
                  <sup className="font-bold">o</sup>F
                </sup>
              </p>
              <p>{data?.weather[0]?.description}</p>
            </div>
          </div>
          {/* section 3 */}
          <div className="flex flex-row justify-between items-center">
            {/* humidity */}
            <div>
              <p className="text-xs text-[#808080]">Humidity</p>
              <span className="font-semibold">
                {data?.main?.humidity}% <Droplet size={10} />
              </span>
            </div>
            {/* feels like */}
            <div>
              <p className="text-xs text-[#808080]">Feels like</p>
              <span className="font-semibold">
                {Math.floor(data?.main?.feels_like)}
                <sup>o</sup> <SunSnow size={10} />
              </span>
            </div>
            {/* wind */}
            <div>
              <p className="text-xs text-[#808080]">Wind</p>
              <span className="font-semibold">
                {Math.floor(data?.wind?.speed)} mph <Wind size={10} />
              </span>
            </div>
          </div>
          {/* section 4 */}
          <div className="my-2 flex flex-row justify-between items-center">
            {/* pressure */}
            <div>
              <p className="text-xs text-[#808080]">Pressure</p>
              <span className="font-semibold">
                {(Math.floor(data?.main?.pressure) * 0.02953).toFixed(2)} in{" "}
                <WindArrowDown size={10} />
              </span>
            </div>
            {/* cloud coverage */}
            <div>
              <p className="text-xs text-[#808080]">Cloud covrg</p>
              <span className="font-semibold">
                {data?.clouds?.all}% <Cloudy size={10} />
              </span>
            </div>

            {/* Visibility */}
            <div>
              <p className="text-xs text-[#808080]">Visibility</p>
              <span className="font-semibold">
                {data && (data?.visibility * 0.000621371).toFixed(1)} mi{" "}
                <Eye size={10} />
              </span>
            </div>
          </div>
        </div>
      ) : data?.cod == "404" ? (
        <div className="flex flex-col flex-1 h-full items-center justify-center gap-5">
          <div className="flex items-center justify-center flex-row gap-5">
            <Cloudy /> <CloudSunRain /> <CloudRain />
          </div>
          <p className={`text-sm text-[#808080] ${loading && "animate-spin"}`}>
            {loading ? <LoaderCircle /> : data?.message}
          </p>
        </div>
      ) : (
        <div className="flex flex-col flex-1 h-full items-center justify-center gap-5">
          <div className="flex items-center justify-center flex-row gap-5">
            <Cloudy /> <CloudSunRain /> <CloudRain />
          </div>
          <div
            className={`text-sm text-[#808080] ${loading && "animate-spin"}`}
          >
            {loading ? <LoaderCircle /> : "Enter a city to check the weather"}
          </div>
        </div>
      )}

      {/* footer */}
      <div className="z-50 w-full absolute p-1 bottom-0 bg-[#1d1d1d] rounded-xl">
        <form onSubmit={(e) => getWeather(e)} className="flex flex-row gap-x-2">
          <input
            className="w-full text-[#808080] placeholder:text-[#808080] rounded-xl p-2 bg-[#262626] border-none outline-none "
            type="search"
            placeholder="Enter city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button
            type="submit"
            className={`bg-[#262626] px-5 rounded-xl ${
              city.length > 1
                ? "text-white hover:shadow-sm hover:shadow-sky-100/40"
                : "text-[#2f2f2f]"
            }`}
          >
            Search
          </button>
        </form>
      </div>
    </div>
  );
}
export default Weather;