import { IonCard, IonList } from "@ionic/react";
import React from "react";
import RecipeIngredientProps from "../interfaces/RecipeIngredientProps";
import RecipeIngredient from "./RecipeIngredient";

const RecipeIngredients: React.FC<RecipeIngredientProps[]> = (props) => {
 
  return (
      <IonCard>
        <IonList>
                { props.map(({ingredient, id, quantity}) => {
                <RecipeIngredient ingredient={ingredient} quantity={quantity} id={id} />
                })
                }

        </IonList>
    </IonCard>
      
  );
};

export default RecipeIngredients;
