import React, { useState } from 'react';
import { IonCard, IonCardContent, IonCardTitle, IonContent, IonFabButton, IonHeader, IonIcon, IonItemDivider, IonList, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import Recipe from './Recipe';
import './recipeList.css';
import { RouteComponentProps } from 'react-router';
import RecipeProps from '../interfaces/RecipeProps';
import { getLogger } from '../core';
import { add, addCircleOutline } from 'ionicons/icons';
import IngredientProps from '../interfaces/IngredientProp';
import RecipeIngredientProps from '../interfaces/RecipeIngredientProps';
import RecipeIngredient from './RecipeIngredient';

const recipesProvider = () => {
    var recipeList: RecipeProps[]   
    const ingredients = ingredientProvider();
    var recipeIngredients1, recipeIngredients2, recipeIngredients3, recipeIngredients4: RecipeIngredientProps[]
    recipeIngredients1 = [{id: 1, ingredient: ingredients[0], quantity: 2},{id: 2, ingredient: ingredients[1], quantity: 3}]
    recipeIngredients2 = [{id: 1, ingredient: ingredients[2], quantity: 1},{id: 2, ingredient: ingredients[3], quantity: 1.5}]
    recipeIngredients3 = [{id: 1, ingredient: ingredients[0], quantity: 1}]
    recipeIngredients4 = [{id: 1, ingredient: ingredients[3], quantity: 1},{id: 2, ingredient: ingredients[1], quantity: 2.2}, {id: 2, ingredient: ingredients[0], quantity: 2.2}]

    recipeList = [ 
        { id: 1, name: "Banana bread", origin: "Romania", ingredients: recipeIngredients1, triedIt:true, date: new Date('2020-10-11'), text: "descriptionBanana", likes: 2},
        { id: 2, name: "Pizza", origin: "Italy", ingredients: recipeIngredients2, triedIt:true, date: new Date('2020-10-11'), text: "descriptionPizza", likes: 2},
        { id: 3, name: "Icecream", origin: "Italy", ingredients: recipeIngredients3, triedIt:false, date: new Date('2020-10-11'), text: "descriptionIcecrea", likes: 2},
        { id: 4, name: "Chocolate",  origin: "France", ingredients: recipeIngredients4, triedIt:true, date: new Date('2020-10-11'), text: "descriptionChocolate", likes: 20}
    ];
    return recipeList;
   }

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


const RecipeList: React.FC<RouteComponentProps> = ({history}) =>  {
    const [state, setRecipes] = useState({ 
        recipes: recipesProvider(), selected: 1});

    const addRecipe = () => {
        const {recipes, selected} = state;
        const id = recipes.length + 1;
        const text = "txt";
        const name = "name";
        const origin = "Romania";
        const date = new Date("2019-08-05");
        const triedIt = false;
        var ingredients: RecipeIngredientProps[];
        ingredients = [];
        const recipes2 = recipes.concat({ id, origin, date, ingredients, triedIt, text, name, likes:0});
        setRecipes({recipes: recipes2, selected: selected});
    }
    const removeRecipe = (id: number) => {
        const {recipes} = state;
        const recipes2 = recipes.filter(recipe => recipe.id!==id)
        setRecipes({...state, recipes: recipes2});
    }
    
    const { recipes } = state;
    return (  
        <IonPage>
            <IonHeader>
                <IonToolbar color="tertiary">
                  <IonTitle>Cool Recipies App</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent color="light">  
                <IonCard id="recipeList">
                    <IonCardTitle class="cardTitle">My recipes  :)</IonCardTitle>
                    <IonCardContent >
                        <IonList >
                        {recipes.map(({id, text, name, likes, ingredients, origin, date, triedIt}) => 
                        <Recipe key={id} id={id} origin={origin} ingredients={ingredients} date={date} triedIt={triedIt} name={name} text={text} likes={likes} 
                        editRecipe={id => history.push(`/item/${id}`)}
                        removeRecipe={id => removeRecipe(id)}/>
                        )} 
                        <IonFabButton id="addButton" color="tertiary" onClick={addRecipe}> <IonIcon icon={add}></IonIcon></IonFabButton>                     
                        </IonList>
                    </IonCardContent>
                </IonCard>
            </IonContent>
        </IonPage>
    );
}
export default RecipeList;