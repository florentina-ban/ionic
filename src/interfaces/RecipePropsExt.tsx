import RecipeProps from "./RecipeProps";

interface RecipePropsExt extends RecipeProps{
    editRecipe: (id? : number) => void;
    removeRecipe: (id: number) => void;
    saveRecipep: (recipe: RecipeProps) => void;
    menuOpened: boolean;
}

export default RecipePropsExt;