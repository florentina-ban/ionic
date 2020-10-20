import React, { useState } from 'react';
import { IonCard, IonCardContent, IonCardTitle, IonCheckbox, IonContent, IonDatetime, IonHeader, IonInput, IonItem, IonItemDivider, IonLabel, IonNote, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './editRecipe.css';
import RecipePropsRoute from '../interfaces/RecipePropsRoute';
import { getLogger } from '../core';
import RecipeIngredients from './RecipeIngredients';
import IngredientProps from '../interfaces/IngredientProp';
import RecipeProps from '../interfaces/RecipeProps';
import RecipeIngredientProps from '../interfaces/RecipeIngredientProps';

const recipeProvider = (id: number) => {
    var recipeList: RecipeProps[]   
    const ingredients = ingredientProvider();
    var recipeIngredients1, recipeIngredients2, recipeIngredients3, recipeIngredients4: RecipeIngredientProps[]
    recipeIngredients1 = [{id: 1, ingredient: ingredients[0], quantity: 2},{id: 2, ingredient: ingredients[1], quantity: 3}]
    recipeIngredients2 = [{id: 1, ingredient: ingredients[2], quantity: 1},{id: 2, ingredient: ingredients[3], quantity: 1.5}]
    recipeIngredients3 = [{id: 1, ingredient: ingredients[0], quantity: 1}]
    recipeIngredients4 = [{id: 1, ingredient: ingredients[3], quantity: 1},{id: 2, ingredient: ingredients[1], quantity: 2.2}, {id: 2, ingredient: ingredients[0], quantity: 2.2}]

    return (id === 1) ? { id: 1, name: "Banana bread", ingredients:recipeIngredients1, origin: "Romania", triedIt:true, date: new Date('2020-10-11'),  text: "descriptionBanana", likes: 2} :
        (id === 2) ? { id: 2, name: "Pizza", ingredients: recipeIngredients2, origin: "Romania", triedIt:true, date: new Date('2020-10-11'), text: "descriptionPizza", likes: 2} :
        (id === 3) ? { id: 3, name: "Icecream", ingredients: recipeIngredients3, origin: "Romania", triedIt:true, date: new Date('2020-10-11'), text: "descriptionIcecrea", likes: 2} : 
        { id: 4, name: "Chocolate", origin: "Romania", ingredients: recipeIngredients4, triedIt:true, date: new Date('2020-10-11'), text: "descriptionChocolate", likes: 20};
}
const logger = getLogger("editRecipe");

const ingredientProvider = () =>{
    var ingredients: IngredientProps[] = [];
    const ingredient1 = {id: 1, name:"flour"};
    const ingredient2 = {id: 2, name:"onion"};
    const ingredient3 = {id: 3, name:"potatoes"};
    const ingredient4 = {id: 4, name:"milk"};
    ingredients.push(ingredient1);
    ingredients.push(ingredient2);
    ingredients.push(ingredient3);
    ingredients.push(ingredient4);

    return ingredients;
}


const EditRecipe: React.FC<RecipePropsRoute> = ({history, match}) =>  {
logger("orice");
    const currentRecipe = recipeProvider(+match.params.id);
    const [state, setState] = useState(currentRecipe);
    const { text, date, triedIt, ingredients, name, likes } = currentRecipe;
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar  color="tertiary">
                <IonTitle>Cool Recipies App</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>     
                <IonCard id="editRecipe">
                    <IonCardTitle class="cardTitle">{name}</IonCardTitle>
                    <IonCardContent id="cardContent">                        
                        <IonItem key={text}>
                            <IonNote>Description: </IonNote>
                            <IonInput value={text} />
                        </IonItem>                      
                        <IonItem key={likes}>
                            <IonNote>Likes: </IonNote>
                            <IonInput value={likes} />
                        </IonItem>
                        <IonItem key="triedIt">
                            <IonNote>Tried it: </IonNote>
                            <IonCheckbox checked={triedIt}/>
                        </IonItem>
                        <IonItem key={date.toDateString()}>
                            <IonNote>Date: </IonNote>
                            <IonDatetime value={date.toDateString()}></IonDatetime>
                        </IonItem>                       
                        <RecipeIngredients ingredients={ingredients}></RecipeIngredients>                
                    </IonCardContent>
                </IonCard>
            </IonContent>
         </IonPage>     
    );
}
export default EditRecipe;;