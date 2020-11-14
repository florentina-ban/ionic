
interface RecipeProps {
    _id?: string;
    name: string;
    origin: string;
    date: Date;
    description: string;
    triedIt: boolean;
    likes: number;
}

export default RecipeProps;