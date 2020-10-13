import React, { useState } from 'react';
import { IonCard, IonCardContent, IonCardTitle, IonContent, IonFabButton, IonHeader, IonIcon, IonItemDivider, IonList, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import Recipe from './Recipe';
import './recipeList.css';
import { RouteComponentProps } from 'react-router';
import RecipeProps from '../interfaces/RecipeProps';
import { getLogger } from '../core';
import { add, addCircleOutline } from 'ionicons/icons';

const recipesProvider = () => {
    var recipeList: RecipeProps[]   
    recipeList = [ 
        { id: 1, name: "Banana bread", origin: "Romania", triedIt:true, date: new Date('2020-10-11'), text: "descriptionBanana", likes: 2},
        { id: 2, name: "Pizza", origin: "Italy", triedIt:true, date: new Date('2020-10-11'), text: "descriptionPizza", likes: 2},
        { id: 3, name: "Icecream", origin: "Italy", triedIt:false, date: new Date('2020-10-11'), text: "descriptionIcecrea", likes: 2},
        { id: 4, name: "Chocolate",  origin: "France", triedIt:true, date: new Date('2020-10-11'), text: "descriptionChocolate", likes: 20}
    ];
    return recipeList;
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
        const recipes2 = recipes.concat({ id, origin, date, triedIt, text, name, likes:0});
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
                        {recipes.map(({id, text, name, likes, origin, date, triedIt}) => 
                        <Recipe key={id} id={id} origin={origin} date={date} triedIt={triedIt} name={name} text={text} likes={likes} 
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