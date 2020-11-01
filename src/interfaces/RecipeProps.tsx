import RecipeIngredientProps from './RecipeIngredientProps';

interface RecipeProps {
    id: number;
    name: string;
    origin: string;
    date: Date;
    text: string;
    triedIt: boolean;
    likes: number;
    recipeIngredients: RecipeIngredientProps[];
}

export default RecipeProps;