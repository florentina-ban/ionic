import { IonItem, IonLabel, IonNote } from "@ionic/react";
import React, { useState } from "react";
import IngredientProps from "../interfaces/IngredientProp";

interface RecipeIngredientProps {
    ingredient: IngredientProps
    id: number
    quantity: number
}

const RecipeIngredient: React.FC<RecipeIngredientProps> = (props) => {
  const [state, setState] = useState(props);
  const { ingredient, id, quantity} = state;

  return (
    <IonItem>
      <IonNote>Ingredient</IonNote>
      <IonLabel>{ingredient.name}</IonLabel>
      <IonNote>Quantity</IonNote>
      <IonLabel>{quantity}</IonLabel>
    </IonItem>
  );
};

export default RecipeIngredient;
