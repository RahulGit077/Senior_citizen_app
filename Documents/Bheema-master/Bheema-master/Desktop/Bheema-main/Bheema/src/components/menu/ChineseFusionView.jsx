

import React from "react";
import MealSection from "./MealSection";

const ChineseFusionView = ({ chineseDishes, onAddToCart }) => {
  return (
    <MealSection
      title="Indo-Chinese Fusion"
      dishes={chineseDishes}
      onAddToCart={onAddToCart}
    />
  );
};

export default ChineseFusionView;
