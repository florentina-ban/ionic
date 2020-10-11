import React from 'react';

interface RecipeProps {
    id: number;
    name: string;
    origin: string;
    date: Date;
    text: string;
    triedIt: boolean;
    likes: number;
    
}

export default RecipeProps;