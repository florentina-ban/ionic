import RecipeProps from "./RecipeProps";

interface RecipePropsExt extends RecipeProps{
    editRecipe: (id? : number) => void;
}

export default RecipePropsExt;