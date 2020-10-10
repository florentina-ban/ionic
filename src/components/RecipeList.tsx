import React, { useState } from 'react';
import { IonCard, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import Recipe from './Recipe';
import './recipeList.css';
import { RouteComponentProps } from 'react-router';
import RecipeProps from '../interfaces/RecipeProps';

const recipesProvider = () => {
    var recipeList: RecipeProps[]   
    recipeList = [ 
        { id: 1, name: "Banana bread", text: "descriptionBanana", likes: 2},
        { id: 2, name: "Pizza", text: "descriptionPizza", likes: 2},
        { id: 3, name: "Icecream", text: "descriptionIcecrea", likes: 2},
        { id: 4, name: "Chocolate", text: "descriptionChocolate", likes: 20}
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
        const recipes2 = recipes.concat({ id, text, name, likes:0});
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
                    {recipes.map(({id, text, name, likes}) => 
                    <Recipe key={id} id={id} name={name} text={text} likes={likes} editRecipe={id => history.push(`/item/${id}`)}/>
                    )} 
                </IonCard>
            </IonContent>
        </IonPage>
    );
}
export default RecipeList;