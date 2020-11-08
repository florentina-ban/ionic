
interface RecipeProps {
    id?: string;
    name: string;
    origin: string;
    date: Date;
    description: string;
    triedIt: boolean;
    likes: number;
}

export default RecipeProps;