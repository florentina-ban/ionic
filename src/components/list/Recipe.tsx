import { IonFabButton, IonIcon, IonItem, IonLabel, IonNote} from '@ionic/react';
import {  buildOutline, thumbsUp, trashBinOutline } from 'ionicons/icons';
import React from 'react';
import { getLogger } from '../../core/logger';
import RecipeProps from './RecipeProps';
import './recipeList.css';

interface RecipePropsExt extends RecipeProps{
  editRecipe: (_id? : string) => void;
  removeRecipe: (_id: string) => void;
  saveRecipep: (recipe: RecipeProps) => void;

}


const Recipe: React.FC<RecipePropsExt> = ({date, description, triedIt, name, likes, origin, _id, saveRecipep, removeRecipe, editRecipe}) => {

    const logger = getLogger("recipe");

    const onEditRecipe = () => {
        editRecipe(_id);
    }
 
    const onDelete = () =>  {
     // console.log(id);
      if (_id)
        removeRecipe(_id); 
    }
 
    const onSaveRecipep = () => {
      const likes1 = likes + 1;
      
      const recipe3 = { _id, name, description, date, triedIt, origin, likes:likes1 };
      saveRecipep(recipe3);
    }
    return (    
        <IonItem key={_id}>
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
