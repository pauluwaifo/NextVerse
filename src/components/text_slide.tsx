import React, { useEffect, useState } from "react";

const Prompt: React.FC<{ prompts: string[] }> = ({ prompts }) => {
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPromptIndex((prevIndex) => (prevIndex + 1) % prompts.length);
    }, 3000); // Change prompt every 3 seconds

    return () => clearInterval(interval);
  }, [prompts.length]);

  return <div className="slide-up text-[#808080]">{prompts[currentPromptIndex]}</div>;
};

export default Prompt;
