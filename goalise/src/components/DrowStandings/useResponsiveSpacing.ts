import { useEffect, useState } from "react";

export const useResponsiveSpacing = () => {
  const [spacing, setSpacing] = useState(80);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 758) setSpacing(200);
      else if (w < 1090) setSpacing(18);
      else if (w < 1224) setSpacing(28);
      else setSpacing(80);
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return spacing;
};
