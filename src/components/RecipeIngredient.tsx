import React from "react";
import IngredientProp from "../interfaces/IngredientProp"

interface RecipeIngredientProps {
    recipeIngredient: IngredientProp 
    id: number
    quantity: number
}

const RecipeIngredient: React.FC<RecipeIngredientProps> = ({ id, recipeIngredient, quantity }) => {
  return (
    <div>ingredient</div>
  );
};

export default RecipeIngredient;
