import React, { useContext, useState } from 'react';
import { IonCard, IonCardContent, IonCardTitle, IonContent, IonFabButton, IonHeader, IonIcon, IonList, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import Recipe from './Recipe';
import './recipeList.css';
import { RouteComponentProps } from 'react-router';
import RecipeProps from '../interfaces/RecipeProps';
import { getLogger } from '../core';
import { add } from 'ionicons/icons';
import { IngredientsContext } from './ItemProvider';
import { RecipesContext } from './RecipesProvider';

const RecipeList: React.FC<RouteComponentProps> = ({history, match}) =>  {
    const logger = getLogger("RecipeList");
    logger("inside recipe list");
    
    const { items } = useContext(IngredientsContext);
    //logger(items);

    const { recipes, saveRecipe, deleteRecipe } = useContext(RecipesContext);
    //logger(recipes);
    
    const [state, setRecipes] = useState({        
        recipes, allingredients: items});

    const addRecipe = () => {
        history.push("/item")
        logger("in add recipe");
    }
    const removeRecipeIns = (id: number) => {
        if (recipes && id && deleteRecipe){
        logger("inside removeRecipe")
        deleteRecipe(id);
        }
    }

    const saveRecipeIns = (recipe: RecipeProps) => {
        if (recipes && recipe && saveRecipe){
        logger("inside removeRecipe")
        saveRecipe(recipe);
        }
    }
      
    return (  
        <IonPage>
            <IonHeader>
                <IonToolbar color="tertiary">
                  <IonTitle>Cool Recipies App</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent color="light">  
                <IonCard id="recipeList">
                    <IonCardTitle class="cardTitle">My recipes</IonCardTitle>
                    <IonCardContent >
                        <IonList >
                        {recipes && recipes.map(({id, text, name, likes, recipeIngredients: ingredients, origin, date, triedIt}) => 
                        <Recipe key={id} id={id} origin={origin} recipeIngredients={ingredients} date={date} triedIt={triedIt} name={name} text={text} likes={likes} menuOpened={false}
                        editRecipe={id => history.push(`/item/${id}`)}
                        removeRecipe={id => removeRecipeIns(id)} saveRecipep={saveRecipeIns} />
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