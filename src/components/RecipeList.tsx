import React, { useState } from 'react';
import { IonCard, IonCardContent, IonCardTitle, IonContent, IonHeader, IonList, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import Recipe from './Recipe';
import './recipeList.css';
import { RouteComponentProps } from 'react-router';
import RecipeProps from '../interfaces/RecipeProps';
import { getLogger } from '../core';

const recipesProvider = () => {
    var recipeList: RecipeProps[]   
    recipeList = [ 
        { id: 1, name: "Banana bread", origin: "Romania", triedIt:true, date: new Date('2020-10-11'), text: "descriptionBanana", likes: 2},
        { id: 2, name: "Pizza", origin: "Romania", triedIt:true, date: new Date('2020-10-11'), text: "descriptionPizza", likes: 2},
        { id: 3, name: "Icecream", origin: "Romania", triedIt:false, date: new Date('2020-10-11'), text: "descriptionIcecrea", likes: 2},
        { id: 4, name: "Chocolate",  origin: "Romania", triedIt:true, date: new Date('2020-10-11'), text: "descriptionChocolate", likes: 20}
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
    const showEditCard = () => {

    }
    const { recipes } = state;
    return (  
        <IonPage>
            <IonHeader>
                <IonToolbar>
                  <IonTitle>Cool Recipies App</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>  
                <IonCard id="recipeList">
                    <IonCardTitle>My recipes  :)</IonCardTitle>
                    <IonCardContent>
                        <IonList>
                        {recipes.map(({id, text, name, likes, origin, date, triedIt}) => 
                        <Recipe key={id} id={id} origin={origin} date={date} triedIt={triedIt} name={name} text={text} likes={likes} editRecipe={id => history.push(`/item/${id}`)}/>
                        )} 
                        </IonList>
                    </IonCardContent>
                </IonCard>
            </IonContent>
        </IonPage>
    );
}
export default RecipeList;