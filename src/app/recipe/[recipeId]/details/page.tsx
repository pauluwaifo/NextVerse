"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { LoaderCircle, CookingPot, Cookie, ChefHat } from "lucide-react";

const RecipeDetails = () => {
  const [recipeDetails, setRecipeDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const API_KEY = process.env.NEXT_PUBLIC_RECIPE_API_KEY;
  const params = useParams();
  const { recipeId } = params;

  const getRecipeById = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${API_KEY}&includeNutrition=true
`
      );
      const data = await response.json();
      setRecipeDetails(data);
    } catch (err) {
      const response = {
        message: "failed to fetch recipe details",
        error: err instanceof Error ? err.message : String(err),
      };
      console.log(response);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRecipeById();
  }, []);

  return (
    <div className="p-5 ">
      <div className="flex flex-col gap-10 p-5 border rounded">
        {loading ? (
          <div className="w-full h-screen items-center justify-center gap-2 flex flex-col gap-5">
            <p
              className={`text-sm text-[#808080] ${loading && "animate-spin"}`}
            >
              {loading && <LoaderCircle />}
            </p>
          </div>
        ) : (
          <>
            {recipeDetails && (
              <>
                <div
                  style={{
                    backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.98), rgba(0, 0, 0, 0.8)), url(${
                      recipeDetails.image || "/default-image.jpg"
                    })`,
                  }}
                  className={`bg-center bg-no-repeat bg-cover flex flex-col items-center w-full justify-center gap-2 py-10 bg-black rounded-xl`}
                >
                  <div className="flex flex-row gap-5">
                    <CookingPot />
                    <Cookie />
                    <ChefHat />
                  </div>
                  <p className="text-3xl font-bold">
                    {recipeDetails && recipeDetails.title}
                  </p>
                </div>

                <div className="flex flex-col gap-1">
                  <p className="text-xl font-bold">Recipes</p>
                  <div className="flex flex-col gap-5">
                    {recipeDetails &&
                      recipeDetails.extendedIngredients.map(
                        (
                          recipe: {
                            nameClean: string;
                            original: string;
                            amount: number;
                            unit: string;
                          },
                          index: number
                        ) => (
                          <div key={index} className="border p-2 rounded-xl">
                            <p className="font-bold"> {recipe.nameClean}</p>
                            <p>{recipe.original}</p>
                          </div>
                        )
                      )}
                  </div>
                </div>

                <div className="flex flex-col gap-1 ">
                  <p className="border p-2 rounded-xlo">cooking minutes: {recipeDetails.cookingMinutes}</p>
                  <p className="text-xl font-bold">Summary</p>
                  {recipeDetails && recipeDetails.summary && (
                    <p
                      dangerouslySetInnerHTML={{
                        __html: recipeDetails.summary,
                      }}
                    ></p>
                  )}
                </div>
              </>
            )}
          </>
        )}
        <div className="flex flex-row items-center justify-center">
          <Link
            className="bg-white text-black px-10 py-1 rounded-xl"
            href={"/"}
          >
            Back
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetails;
