import { IonFabButton, IonIcon, IonInput, IonItem, IonLabel, IonNote, IonSelect, IonSelectOption } from "@ionic/react";
import { trashBinOutline } from "ionicons/icons";
import React, { useState } from "react";
import { getLogger } from "../core";
import IngredientProps from "../interfaces/IngredientProp";
import './editRecipe.css';

interface RecipeIngredientProps {
    ingredient: IngredientProps
    id: number
    quantity: number
}
interface RecipeIngredientPropsExt {
    ingredient: IngredientProps
    id: number
    quantity: number
    removeIngredientFunction: any
}

const ingredientProvider = () =>{
  var ingredients: IngredientProps[] = [];
  const ingredient1 = {id: 1, name:"flour"};
  const ingredient2 = {id: 2, name:"onion"};
  const ingredient3 = {id: 3, name:"potatoes"};
  const ingredient4 = {id: 4, name:"milk"};
  ingredients.push(ingredient1);
  ingredients.push(ingredient2);
  ingredients.push(ingredient3);
  ingredients.push(ingredient4);

  return ingredients;
}

const logger = getLogger("recipeIngredient");

const RecipeIngredient: React.FC<RecipeIngredientPropsExt> = (props) => {
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

 const allIngredients = ingredientProvider();
  return (
    <IonItem key={id}>
      <IonNote>{id}</IonNote>
        <IonSelect selectedText={ingredient.name} onIonChange={changeIngredient}>
         { allIngredients.map((ingr) =>          
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
