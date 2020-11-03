import { IonFabButton, IonIcon, IonItem, IonLabel, IonNote} from '@ionic/react';
import {  buildOutline, thumbsUp, trashBinOutline } from 'ionicons/icons';
import React, { useState } from 'react';
import { getLogger } from '../core';
import RecipeProps from '../interfaces/RecipeProps';
import RecipePropsExt from '../interfaces/RecipePropsExt';
import './recipeList.css';

const Recipe: React.FC<RecipePropsExt> = (props) => {

    const logger = getLogger("recipe");
    logger("recipe");
    const [state, setState] = useState<RecipePropsExt>(props);

    const {id, name, text, likes, recipeIngredients: ingredients, date, triedIt, origin, saveRecipep} = state;

    const onEditRecipe = () => {
        const { editRecipe } = state;
        editRecipe(id);
    }
    const onDelete = () =>  {
      const {removeRecipe} = state;
      if (id){
        removeRecipe(id);
       
      }
    }
    const onSaveRecipep = () => {
      const likes2 = likes + 1;
      const recipe3 = { id, name, text, likes, recipeIngredients: ingredients, date, triedIt, origin};
      saveRecipep(recipe3);
      setState({...state, likes: likes2 }); 
    }
   
  return (    
        <IonItem key={"id"+id?.toFixed()}>
          <IonLabel class="largeLabel">{name}</IonLabel>
          <IonNote>Origin</IonNote>
          <IonLabel class="normalLabel">{origin}</IonLabel>
          <IonNote>Likes</IonNote>
          <IonLabel class="smallLabel">{likes}</IonLabel>

          <div className="buttonsContainer">
          <IonFabButton size="small" color="tertiary" onClick={onSaveRecipep}>
            <IonIcon icon={thumbsUp} />
          </IonFabButton>
          <IonFabButton size="small" color="tertiary">
            <IonIcon icon={buildOutline}  onClick={onEditRecipe}/>
          </IonFabButton>
          <IonFabButton size="small" color="tertiary" onClick={onDelete}>
            <IonIcon icon={trashBinOutline} />
          </IonFabButton>
          
          </div>    
        </IonItem>

  );
};

export default Recipe;
