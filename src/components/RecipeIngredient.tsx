import { IonFabButton, IonIcon, IonInput, IonItem, IonNote, IonSelect, IonSelectOption } from "@ionic/react";
import { trashBinOutline } from "ionicons/icons";
import React, { useContext, useState } from "react";
import { getLogger } from "../core";
import IngredientProps from "../interfaces/IngredientProp";
import './editRecipe.css';
import { IngredientsContext } from "./ItemProvider";

interface RecipeIngredientPropsExt {
    ingredient: IngredientProps
    id: number
    quantity: number
    removeIngredientFunction: any
}

const logger = getLogger("recipeIngredient");

const RecipeIngredient: React.FC<RecipeIngredientPropsExt> = (props) => {

  const { items, fetching, fetchingError } = useContext(IngredientsContext);
  const [state, setState] = useState(props);
  const { ingredient, id, quantity, removeIngredientFunction} = state;

  const changeIngredient = (event: CustomEvent) => {
    logger(event.detail.value);
    setState ( {id, ingredient: event.detail.value, quantity, removeIngredientFunction });
  }

  const deleteIngredient = (event: React.MouseEvent<HTMLIonFabButtonElement, MouseEvent>) => {
    logger(event);
    removeIngredientFunction(id);
  }

 const allIngredients = items;
  return (
    <IonItem key={id}>
      <IonNote>{id}</IonNote>
        <IonSelect selectedText={ingredient.name} onIonChange={changeIngredient}>
         { allIngredients && allIngredients.map((ingr) =>          
               <IonSelectOption class="comboItem" value={ingr}>{ingr.name}</IonSelectOption>
          )}
      </IonSelect>
      <IonNote>Quantity</IonNote>
      <IonInput value={quantity}></IonInput>
      <IonFabButton size="small" color="tertiary" onClick={deleteIngredient}>
            <IonIcon icon={trashBinOutline} />
      </IonFabButton>
    </IonItem>
  );
};

export default RecipeIngredient;
