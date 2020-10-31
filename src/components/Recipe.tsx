import { IonFabButton, IonIcon, IonItem, IonLabel, IonNote} from '@ionic/react';
import {  buildOutline, thumbsUp, trashBinOutline } from 'ionicons/icons';
import React, { useState } from 'react';
import { getLogger } from '../core';
import RecipePropsExt from '../interfaces/RecipePropsExt';
import './recipeList.css';

const Recipe: React.FC<RecipePropsExt> = (props) => {

    const logger = getLogger("recipe");
    logger("recipe");

    const [state, setState] = useState<RecipePropsExt>(props);

    const addLike = () => {
        const { likes } = state;
        const likeNo = likes + 1;
        setState({...state, likes: likeNo});
    }
    const {id, name, text, likes, ingredients, date, triedIt, origin, menuOpened} = state;

    const onEditRecipe = () => {
        const { editRecipe } = state;
        editRecipe(id);
    }
    const onDelete = () =>  {
      const {removeRecipe} = state;
      removeRecipe(id);

    }
    const openMenu = () => {
     const { menuOpened } = state;
     const newValue = !menuOpened ;
     setState({...state, menuOpened: newValue});

    }

  return (    
        <IonItem>
          <IonLabel class="largeLabel">{name}</IonLabel>
          <IonNote>{id}</IonNote>
          <IonNote>Origin</IonNote>
          <IonLabel class="normalLabel">{origin}</IonLabel>
          <IonNote>Likes</IonNote>
          <IonLabel class="smallLabel">{likes}</IonLabel>

          {/* <IonFabButton size="small" color="tertiary"><IonIcon icon={listOutline}  onClick={openMenu}/> </IonFabButton>
            
          <IonSelect >            
            <IonSelectOption>Like</IonSelectOption>
            <IonSelectOption onSelect={onEditRecipe}>Edit </IonSelectOption>
            <IonSelectOption onSelect={onDelete}>Delete</IonSelectOption>
          </IonSelect>
         */}
         
          <div className="buttonsContainer">
          <IonFabButton size="small" color="tertiary" onClick={addLike}>
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
