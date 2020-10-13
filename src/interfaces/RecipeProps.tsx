import RecipeIngredientProps from './RecipeIngredientProps';

interface RecipeProps {
    id: number;
    name: string;
    origin: string;
    date: Date;
    text: string;
    triedIt: boolean;
    likes: number;
    ingredients?: RecipeIngredientProps[];
}

export default RecipeProps;