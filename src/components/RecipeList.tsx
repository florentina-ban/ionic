import React, { useContext, useState } from 'react';
import { IonCard, IonCardContent, IonCardTitle, IonContent, IonFabButton, IonHeader, IonIcon, IonList, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import Recipe from './Recipe';
import './recipeList.css';
import { RouteComponentProps } from 'react-router';
import RecipeProps from '../interfaces/RecipeProps';
import { getLogger } from '../core';
import { add } from 'ionicons/icons';
import RecipeIngredientProps from '../interfaces/RecipeIngredientProps';
import { IngredientsContext } from './ItemProvider';
import { RecipesContext } from './RecipesProvider';

const RecipeList: React.FC<RouteComponentProps> = ({history}) =>  {
    const logger = getLogger("RecipeList");
    logger("inside recipe list");
    
    const { items, fetching, fetchingError } = useContext(IngredientsContext);
    logger(items);

    const { recipes, fetchingR, fetchingErrorR } = useContext(RecipesContext);
    logger(recipes);
    
    const [state, setRecipes] = useState({        
        recipes, allingredients: items});

    const addRecipe = () => {
        const {allingredients} = state;
        var id;
        if (recipes!=undefined)
            id = recipes.length + 10;
        else
            id = 100;
      
        const text = "txt";
        const name = "name";
        const origin = "Romania";
        const date = new Date("2019-08-05");
        const triedIt = false;
        var ingredients: RecipeIngredientProps[];
        ingredients = [];
        let recipes2: RecipeProps[] = [];
        if (recipes)
            recipes2 = recipes.concat({ id, origin, date, ingredients, triedIt, text, name, likes:0});
        else
            recipes2 = []
        setRecipes({recipes: recipes2, allingredients});
    }
    const removeRecipe = (id: number) => {
       if (recipes){
        const recipes2 = recipes.filter(recipe => recipe.id!==id)
        setRecipes({...state, recipes: recipes2});
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
                        {recipes && recipes.map(({id, text, name, likes, ingredients, origin, date, triedIt}) => 
                        <Recipe key={id} id={id} origin={origin} ingredients={ingredients} date={date} triedIt={triedIt} name={name} text={text} likes={likes} menuOpened={false}
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