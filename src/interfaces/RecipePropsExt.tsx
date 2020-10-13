import RecipeProps from "./RecipeProps";

interface RecipePropsExt extends RecipeProps{
    editRecipe: (id? : number) => void;
    removeRecipe: (id: number) => void;
}

export default RecipePropsExt;