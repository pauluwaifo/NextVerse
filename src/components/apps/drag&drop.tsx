"use client";

import { useEffect, useRef, useState } from "react";
import { Sortable } from "@shopify/draggable";
import Image from "next/image";

const puzzle_img_1 = "/assets/puzzle.jpg";
const puzzle_img_2 = "/assets/chair.jpg";

const gridSize = 3; // 3x3 puzzle
const originalOrder = Array.from({ length: gridSize * gridSize }, (_, i) => i);

// Shuffle the pieces randomly
const shuffleArray = (array: number[]) => {
  return [...array].sort(() => Math.random() - 0.5);
};

function PuzzleGame() {
  const [pieces, setPieces] = useState(() => shuffleArray(originalOrder));
  const [isSolved, setIsSolved] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [imageSrc, setImgSrc] = useState<boolean>(true);

  const reset = () => {
    if (!containerRef.current) return;

    const sortable = new Sortable(containerRef.current, {
      draggable: ".puzzle-piece",
    });

    sortable.on("sortable:sorted", (event) => {
      const { newIndex, oldIndex } = event;
      if (newIndex === oldIndex) return;

      setPieces((prevPieces) => {
        const updatedPieces = [...prevPieces];
        const [movedPiece] = updatedPieces.splice(oldIndex, 1);
        updatedPieces.splice(newIndex, 0, movedPiece);

        // Check if the puzzle is solved
        const solved = updatedPieces.every(
          (num, i) => num === originalOrder[i]
        );
        setIsSolved(solved);
        return updatedPieces;
      });
    });

    return () => sortable.destroy();
  };

  useEffect(() => {
    if (isSolved) {
      setIsSolved(false);
      setTimeout(() => {
        setPieces(shuffleArray(originalOrder));
        setImgSrc(!imageSrc);
      }, 2000)
    }
  }, [isSolved]);


  useEffect(() => {
    reset();
  }, []);

  return (
    <div className="bg-[#090909] rounded-xl h-[450px] w-[630px] overflow-hidden flex flex-col items-center justify-center bg-gray-900 text-white p-4">
      <h1 className="text-2xl font-bold mb-4">🧩 Solve the Puzzle!</h1>

      <div className="flex flex-row gap-5">
        {/* Original Image Reference */}
        <div className=" p-2 mb-4">
          <Image src={imageSrc ? puzzle_img_1 : puzzle_img_2} width={200} height={200} alt="Puzzle Preview" />
          <p className="text-sm text-gray-300 text-center">Reference Image</p>
        </div>

        {/* Puzzle Grid */}
        <div
          ref={containerRef}
          className="overflow-hidden grid grid-cols-3  bg-gray-800 p-2 border border-gray-600 "
          style={{ width: "300px", height: "300px" }}
        >
          {pieces.map((index) => {
            const row = Math.floor(index / gridSize);
            const col = index % gridSize;
            return (
              <div
                key={index}
                data-id={index}
                className="puzzle-piece cursor-grab border"
                style={{
                  width: "100px",
                  height: "100px",
                  backgroundImage: `url(${imageSrc ? puzzle_img_1 : puzzle_img_2})`,
                  backgroundSize: "300px 300px",
                  backgroundPosition: `-${col * 100}px -${row * 100}px`,
                }}
              />
            );
          })}
        </div>
      </div>

      {isSolved && (
        <div className="mt-4 text-green-400 text-lg font-semibold">
          🎉 You solved the puzzle!
        </div>
      )}
    </div>
  );
}
export default PuzzleGame;