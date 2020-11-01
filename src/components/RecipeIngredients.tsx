import { IonFabButton, IonIcon, IonList, IonNote} from "@ionic/react";
import { add } from "ionicons/icons";
import React, { useState } from "react";
import { getLogger } from "../core";
import RecipeIngredientsListProps from "../interfaces/RecipeIngredientsListProps";
import RecipeIngredient from "./RecipeIngredient";

const RecipeIngredients: React.FC<RecipeIngredientsListProps> = (props) => {
    
    const [state, setState] = useState(props)
    const { recipeIngredients } = state;
    const logger = getLogger("recipeIngredients");
    
    const addIngredient = () =>{
      const id1 = recipeIngredients.length + 1;
      const ingredients2 = recipeIngredients.concat({id: id1, quantity: 0, ingredient: {id: 1, name: "flour"} });
        setState({recipeIngredients: ingredients2});
    }

    const removeIngredient = (id: Number) => {
      const ingredients2 = recipeIngredients.filter(ingr => { return ingr.id !== id});
      logger(ingredients2);
      setState( {...state, recipeIngredients: ingredients2} );
    }
 
  return (  
   <div>
      <IonNote>Ingredients:</IonNote>
        
          <IonList id="ingredientsList">
                { recipeIngredients.map(({ingredient, id, quantity}) =>                
                 <RecipeIngredient ingredient={ingredient} quantity={quantity} id={id} removeIngredientFunction={removeIngredient}/>
                )}             
                <IonFabButton size="small" slot="end" color="tertiary" id="addIngredientButton" onClick={addIngredient}> <IonIcon  icon={add}></IonIcon></IonFabButton>
          </IonList> 
    </div>  
  );
};

export default RecipeIngredients;
