import {
  Search,
  ChefHat,
  Cookie,
  CookingPot,
  LoaderCircle,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Prompt from "../text_slide";
import Link from "next/link";
function Recipe() {
  const [data, setData] = useState<any>(null);
  const [recipeDetails, setRecipeDetails] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [id, setId] = useState<number>();
  const [isImageValid, setIsImageValid] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [focused, setFocused] = useState<boolean>(false);
  const API_KEY = process.env.NEXT_PUBLIC_RECIPE_API_KEY;
  const prompts = ['Try "Pasta"', 'Try "Pizza"', 'Try "Salad"', 'Try "Cake"'];
  const checkSearch = () => {
    if (searchQuery.length > 0) {
      setFocused(true);
    } else {
      setFocused(false);
    }
  };

  const getRecipe = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (searchQuery.length > 1) {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.spoonacular.com/recipes/complexSearch?query=${searchQuery}&apiKey=${API_KEY}&includeNutrition=true`
        );
        const data = await response.json();
        setData(data.results);
        setSearchQuery("");
      } catch (err) {
        const response = {
          message: "failed to fetch recipe details",
          error: err instanceof Error ? err.message : String(err),
        };
        console.log(response);
      } finally {
        setLoading(false);
      }
    }
  };



  return (
    <div className="relative overflow-hidden shadow-xl bg-[#2f2f2f]/20 rounded-xl h-[300px] md:w-[400px] sm:w-screen">
      {/* header */}
      <div className="overflow-hidden absolute w-full top-0 left-0 p-2 backdrop-blur-lg bg-white/10 rounded-xl">
        <form
          onSubmit={(event) => getRecipe(event)}
          className="relative flex flex-row  p-1 gap-2 rounded-full overflow-hidden backdrop-blur-lg bg-white/1"
        >
          <input
            type="search"
            className={`bg-transparent w-full p-1 border-none outline-none placeholder:text-[#808080] transition-all duration-350 ease-in-out ${
              focused ? "placeholder:opacity-1" : "placeholder:opacity-0"
            } `}
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder={`Recipe`}
            onFocus={() => setFocused(true)}
            onBlur={() => checkSearch()}
          />
          <button
            type="submit"
            className="backdrop-blur-lg bg-white/10 rounded-full p-2"
          >
            <Search
              size={18}
              stroke={searchQuery.length > 0 ? "white" : "#808080"}
            />
          </button>
          <div
            className={`${
              focused ? "opacity-0" : "opacity-1"
            } z-[-100] top-0 left-0 items-center flex absolute px-2 w-full h-full flex-row overflow-hidden`}
          >
            <Prompt prompts={prompts} />
          </div>
        </form>
      </div>

      {loading || !data || (data && data.length < 1) ? (
        <div className="w-full h-full items-center justify-center gap-2 flex flex-col gap-5">
          <div className="flex flex-row gap-5">
            <CookingPot />
            <Cookie />
            <ChefHat />
          </div>
          <p className={`text-sm text-[#808080] ${loading && "animate-spin"}`}>
            {loading ? (
              <LoaderCircle />
            ) : !data ? (
              "Explore different recipes."
            ) : (
              "Recipe not found"
            )}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-5 w-full h-full overflow-auto px-3 py-2 custom_scrollbar">
          {/* food data */}
          <div className="p-8"></div>
          {data &&
            data.map(
              (
                recipe: { title: string; image: string; id: number },
                index: number
              ) => (
                <Link href={`recipe/${recipe.id}/details`}
                  className="group items-center flex flex-row p-2 rounded-full bg-[#2f2f2f]/30 gap-2"
                  key={index}
                  onClick={() => setId(recipe.id)}
                >
                  <Image
                    src={recipe.image ? recipe.image : "food"}
                    alt={recipe.image}
                    height={150}
                    width={150}
                    className=" rounded-full border border-2"
                  />
                  <p className="text-sm group-hover:text-blue-500">
                    {recipe.title}
                  </p>
                </Link>
              )
            )}
        </div>
      )}
    </div>
  );
}
export default Recipe;