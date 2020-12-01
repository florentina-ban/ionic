
interface RecipeProps {
    _id?: string;
    name: string;
    origin: string;
    date: Date;
    description: string;
    triedIt: boolean;
    likes: number;
    location?: number;
}

export default RecipeProps;