import { IonCard, IonFabButton, IonIcon, IonItemDivider, IonList, IonNote, IonSelect } from "@ionic/react";
import { stat } from "fs";
import { add } from "ionicons/icons";
import React, { ComponentProps, useState } from "react";
import { RouteComponentProps } from "react-router";
import { getLogger } from "../core";
import IngredientProps from "../interfaces/IngredientProp";
import RecipeIngredientProps from "../interfaces/RecipeIngredientProps";
import RecipeIngredientsListProps from "../interfaces/RecipeIngredientsListProps";
import RecipeIngredient from "./RecipeIngredient";



const RecipeIngredients: React.FC<RecipeIngredientsListProps> = (props) => {
    
    const [state, setState] = useState(props)
    const { ingredients } = state;
    const logger = getLogger("recipeIngredients");
    
    const addIngredient = () =>{
      const id1 = ingredients.length + 1;
      const ingredients2 = ingredients.concat({id: id1, quantity: 0, ingredient: {id: 1, name: "flour"} });
        setState({ingredients: ingredients2});
    }

    const removeIngredient = (id: Number) => {
      var ingredients2: RecipeIngredientProps[] = [];
      ingredients.forEach(element => {
        if (element.id!=id){
          ingredients2.push(element);
          logger(element);
        }
      });
      setState( {ingredients: ingredients2} );
    }
 
  return (  
        <IonList>
            <IonNote>Ingredients: </IonNote>              
                { ingredients.map(({ingredient, id, quantity}) =>                
                 <RecipeIngredient ingredient={ingredient} quantity={quantity} id={id} removeIngredientFunction={removeIngredient}/>
                )}             
                <IonFabButton size="small" id="addIngredientButton" onClick={addIngredient}> <IonIcon  icon={add}></IonIcon></IonFabButton>
        </IonList>     
  );
};

export default RecipeIngredients;
