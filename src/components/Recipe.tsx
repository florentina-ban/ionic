import {IonFabButton, IonIcon, IonItem, IonLabel, IonNote } from '@ionic/react';
import {  buildOutline, checkboxOutline,  squareOutline, thumbsUp, trashBinOutline } from 'ionicons/icons';
import React, { useState } from 'react';
import RecipePropsExt from '../interfaces/RecipePropsExt';
import './recipeList.css';

const Recipe: React.FC<RecipePropsExt> = (props) => {

    const [state, setState] = useState<RecipePropsExt>(props);

    const addLike = () => {
        const { likes } = state;
        const likeNo = likes + 1;
        setState({...state, likes: likeNo});
    }
    const {id, name, text, likes, date, triedIt, origin} = state;

    const onEditRecipe = () => {
        const { editRecipe } = state;
        editRecipe(id);
    }
    const onDelete = () =>  {
      const {removeRecipe} = state;
      removeRecipe(id);

    }

  return (    
        <IonItem>
          <IonLabel class="normalLabel">{name}</IonLabel>
          <IonNote>Origin</IonNote>
          <IonLabel class="normalLabel">{origin}</IonLabel>
          <IonNote>Tried it</IonNote>
          { triedIt && <IonFabButton color="light" size="small"><IonIcon  icon={checkboxOutline}/></IonFabButton>}
          { !triedIt && <IonFabButton color="light" size="small"><IonIcon icon={squareOutline}/></IonFabButton> } 

          <IonNote>Description</IonNote>
          <IonLabel class="largeLabel">{text}</IonLabel>
          <IonNote>Likes</IonNote>
          <IonLabel class="smallLabel">{likes}</IonLabel>
          <div className="flexInlineContainer">
          <IonFabButton size="small" color="tertiary" onClick={addLike}>
            <IonIcon icon={thumbsUp} />
          </IonFabButton>
          </div>    
          <div className="flexInlineContainer">
          <IonFabButton size="small" color="tertiary">
            <IonIcon icon={buildOutline}  onClick={onEditRecipe}/>
          </IonFabButton>
          </div>
          <div className="flexInlineContainer">
          <IonFabButton size="small" color="tertiary" onClick={onDelete}>
            <IonIcon icon={trashBinOutline} />
          </IonFabButton>
          </div>
        </IonItem>

  );
};

export default Recipe;
