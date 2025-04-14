import React, { useState } from "react";
import { PawPrint, Dog, Cat, LoaderCircle, X, Weight } from "lucide-react";
import Image from "next/image";

interface Props {
  data: any;
  setDisplayDetails: (value: boolean) => void;
}

export const Details: React.FC<Props> = ({ data, setDisplayDetails }) => {
  const height = data.breeds && data?.breeds[0]?.height;
  const weight = data.breeds && data?.breeds[0]?.weight;

  console.log(data);

  return (
    <div className="z-50 w-full h-full relative overflow-hidden left-0 top-0 p-3 backdrop-blur-lg bg-black/60">
      <div className="absolute top-0 left-0  w-full flex justify-center items-center">
        <button
          className="bg-[#111111] rounded-full p-2 shadow"
          onClick={() => setDisplayDetails(false)}
        >
          <X size={15} />
        </button>
      </div>

      <div
        className={`w-full h-full flex p-2 flex flex-col bg-[#111111] rounded-xl gap-2 ${
          data.breeds ? "justify-center" : "items-center justify-center"
        }`}
      >
        <div className="flex flex-row gap-2 items-center">
          <div className="h-[90px] w-[90px] overflow-hidden rounded-full border items-center flex justify-center">
            <Image
              src={data?.url}
              alt={"og/at"}
              style={{ objectFit: "cover", objectPosition: "center center" }}
              width={100}
              height={1}
              priority
            />
          </div>
          <div>
            {data.breeds && (
              <p className="">
                <b>Name:</b> {data?.breeds[0]?.name}
              </p>
            )}
            {data.breeds && (
              <p className="text-sm text-[#808080]">
                <b>Life Span:</b> {data?.breeds[0]?.life_span}
              </p>
            )}
            {data.breeds && (
              <p className="text-sm text-[#808080]">
                <b>Breed Group:</b> {data?.breeds[0]?.breed_group}
              </p>
            )}
          </div>
        </div>
        {data.breeds && (
          <p className="text-sm text-[#808080]">
            <b>Breed for:</b> {data?.breeds[0]?.bred_for}
          </p>
        )}
        {data.breeds && (
          <p className="text-sm text-[#808080]">
            <b>Temperament:</b> {data?.breeds[0]?.temperament}
          </p>
        )}
        <p className="text-sm text-[#808080]">
          <b>Height:</b>{" "}
          {data.breeds ? height && height?.imperial : data.height}
        </p>
        <p className="text-sm text-[#808080]">
          <b>Weight:</b>{" "}
          {data.breeds ? weight && weight?.imperial : data.weight}
        </p>
      </div>
    </div>
  );
};

export default function DogPhotoGallery() {
  const API_KEY = process.env.NEXT_PUBLIC_DOG_API_KEY;
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [dog, setDog] = useState<boolean>(true);
  const [switching, setSwitching] = useState<boolean>(false);
  const [displayDetails, setDisplayDetails] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<any>(null);

  const getData = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setLoading(true);
      const response = await fetch(
        `https://api.the${
          dog ? "dog" : "cat"
        }api.com/v1/images/search?limit=50&breed=${searchQuery}&api_key=${API_KEY}`
      );
      const data = await response.json();
      setData(data);
    } catch (err) {
      const response = {
        message: "failed to fetch data",
        error: err instanceof Error ? err.message : String(err),
      };
      console.log(response);
    } finally {
      setLoading(false);
    }
  };
  const handleDisplayDetails = (data: any) => {
    setDisplayDetails(true);
    setSelectedData(data);
  };
  const handleSwitching = () => {
    setSwitching(true);
    const timeout = setTimeout(() => {
      setSwitching(false);
    }, 3000);
    setData(null);
    return () => clearTimeout(timeout);
  };

  return (
    <div className="relative overflow-hidden shadow-xl bg-[#2f2f2f]/20 rounded-xl sm:w-screen h-[300px] md:w-[500px]">
      {/* header */}
      <div className="z-20 w-full p-2 absolute left-0 top-0 bg-[#111111]">
        <form
          onSubmit={getData}
          className="flex flex-row gap-2 items-center bg-[#1d1d1d] rounded-full p-2"
        >
          <button type="submit" className=" p-1 rounded-full relative">
            {dog ? (
              <Dog
                size={20}
                stroke={searchQuery.length > 1 ? "white" : "#808080"}
              />
            ) : (
              <Cat
                size={20}
                stroke={searchQuery.length > 1 ? "white" : "#808080"}
              />
            )}
            {switching && (
              <div className="w-full h-full absolute bg-blue top-0 left-0 border-b rounded-full animate-spin"></div>
            )}
          </button>
          <input
            className="w-full bg-transparent placeholder:text-[#808080] border-0 outline-0"
            type="search"
            placeholder="Search"
            onChange={(e) => setSearchQuery(e.target.value)}
            value={searchQuery}
          />
        </form>
      </div>

      {/* body */}
      {loading || !data || (data && data.length < 1) ? (
        <div className="w-full h-full items-center justify-center gap-2 flex flex-col gap-5">
          <div className="flex flex-row gap-5">
            <Dog />
            <PawPrint />
            <Cat />
          </div>
          <p className={`text-sm text-[#808080] ${loading && "animate-spin"}`}>
            {loading ? (
              <LoaderCircle />
            ) : !data ? (
              <>
                Welcome to the <b>{dog ? "Dog" : "Cat"}</b> photo gallery
              </>
            ) : (
              "Breed not found"
            )}
          </p>
        </div>
      ) : (
        <div className="custom_scrollbar w-full h-full mt-12 overflow-auto absolute left-0 top-0 ">
          <div className="w-full px-3 flex flex-row flex-wrap justify-around gap-y-5 pt-5 pb-20">
            {data &&
              data.map((dogCat: any, index: number) => (
                <button
                  className="h-[70px] w-[70px] overflow-hidden rounded-full border"
                  key={index}
                  onClick={() => handleDisplayDetails(dogCat)}
                >
                  <Image
                    src={dogCat.url}
                    alt={"og/at"}
                    sizes="cover"
                    width={100}
                    height={1}
                    priority
                  />
                </button>
              ))}
          </div>
        </div>
      )}

      {/* switching screen */}
      {switching && (
        <div className="absolute top-0 left-0 bg-[#111111] z-10 w-full h-full items-center justify-center gap-2 flex flex-col gap-5">
          <div className="flex flex-row gap-5">{dog ? <Dog /> : <Cat />}</div>
          <p className={`text-sm text-[#808080] flex gap-2`}>
            Switching{" "}
            <span className=" animate-spin">
              <LoaderCircle />
            </span>
          </p>
        </div>
      )}

      {/* footer */}
      <div className="absolute flex flex-row gap-2 bottom-0 left-0 w-full p-2">
        <button
          onClick={() => {
            setDog(true);
            !dog && handleSwitching();
          }}
          className={`rounded-full bg-[#1d1d1d] p-1 ${dog ? "border" : ""}`}
        >
          <Dog size={20} stroke={dog ? "white" : "#808080"} />
        </button>

        <button
          onClick={() => {
            setDog(false);
            dog && handleSwitching();
          }}
          className={`rounded-full bg-[#1d1d1d] p-1 ${!dog ? "border" : ""}`}
        >
          <Cat size={20} stroke={!dog ? "white" : "#808080"} />
        </button>
      </div>

      {/* details */}
      {displayDetails && (
        <Details data={selectedData} setDisplayDetails={setDisplayDetails} />
      )}
    </div>
  );
}
