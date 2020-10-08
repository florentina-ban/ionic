import React, { useState } from 'react';
import { IonCard, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonLabel, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import Recipe from './Recipe';
import './recipeList.css';


const RecipeList: React.FC = () =>  {
    const [state, setRecipes] = useState({ 
        recipes: [{name:"Banana bread", id:1, text:"description1", likes:0},
        {name:"Cheese cake", id:2, text:"description2", likes:0},
        {name:"Sarmale", id:3, text:"description3", likes:0}], selected: 1});

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
        <IonCard id="recipeList">
           {recipes.map(({id, text, name, likes}) => 
              <Recipe id={id} name={name} text={text} likes={likes} />
            )}
       
        </IonCard>
    );
}
export default RecipeList;