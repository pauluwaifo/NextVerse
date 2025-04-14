"use client";

import React from "react";
import Weather from "@/components/apps/weather";
import Recipe from "@/components/apps/recipe";
import DogPhotoGallery from "@/components/apps/dog_photo_gallery";
import FaceAuth from "@/components/apps/face_auth";
import InteractiveCube from "@/components/apps/interactive_cube";
import DraggableList from "@/components/apps/drag&drop";

export default function page() {
  return (
    <div className="flex md:flex-row md:flex-wrap md:justify-between md:gap-y-2 p-3">
       <div className="w-[100%] p-5 items-center flex justify-center bg-[#383838] rounded-xl">
        <h2>API APPS</h2>
      </div>
      {/* weather */}
      <div className=" border border-2 border-[#383838]/60 rounded-xl rounded-xl flex flex-col items-center justify-center gap-2">
        <div className="bg-[#2f2f2f]/20 w-full flex items-center justify-center rounded-xl p-1">
          <p>Weather App</p>
        </div>
        <Weather />
      </div>
      {/* Recipe */}
      <div className="border border-2 border-[#383838]/60 rounded-xl  flex flex-col items-center justify-center gap-2">
        <div className="bg-[#2f2f2f]/20 w-full flex items-center justify-center rounded-xl p-1">
          <p>Recipe App</p>
        </div>

        <Recipe />
      </div>
      {/* dogPhotoGallery */}
      <div className="border border-2 border-[#383838]/60 rounded-xl  flex flex-col items-center justify-center gap-2">
        <div className="bg-[#2f2f2f]/20 w-full flex items-center justify-center rounded-xl p-1">
          <p>Dog/Cat Photo Gallery</p>
        </div>

        <DogPhotoGallery />
      </div>

      <div className="w-[100%] p-5 items-center flex justify-center bg-[#383838] rounded-xl">
        <h2>INTERACTIVE APPS</h2>
      </div>

      {/* face mood recognition */}
      <div className="border border-2 border-[#383838]/60 rounded-xl  flex flex-col items-center justify-center gap-2">
        <div className="bg-[#2f2f2f]/20 w-full flex items-center justify-center rounded-xl p-1">
          <p>Mood recognition</p>
        </div>

        <FaceAuth />
      </div>

      {/* Interactive cube */}
      <div className="border border-2 border-[#383838]/60 rounded-xl  flex flex-col items-center justify-center gap-2">
        <div className="bg-[#2f2f2f]/20 w-full flex items-center justify-center rounded-xl p-1">
          <p>Interactive cube</p>
        </div>

        <InteractiveCube />
      </div>
      {/* Interactive cube */}
      <div className="border border-2 border-[#383838]/60 rounded-xl  flex flex-col items-center justify-center gap-2">
        <div className="bg-[#2f2f2f]/20 w-full flex items-center justify-center rounded-xl p-1">
          <p>Draggable list</p>
        </div>

        <DraggableList />
      </div>
    </div>
  );
}
