import { IonButton, IonCheckbox, IonFabButton, IonIcon, IonItem, IonLabel, IonNote } from '@ionic/react';
import { alertCircleOutline, buildOutline, checkboxOutline, checkmark, checkmarkCircleOutline, checkmarkCircleSharp, closeCircleOutline, closeCircleSharp, square, squareOutline, thumbsUp, thumbsUpOutline, thumbsUpSharp, trashBinOutline } from 'ionicons/icons';
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

  return (    
        <IonItem>
          <IonLabel>{name}</IonLabel>
          <IonNote>Origin</IonNote>
          <IonLabel>{origin}</IonLabel>
          <IonNote>Tried it</IonNote>
          { triedIt && <IonFabButton size="small"><IonIcon  icon={checkboxOutline}/></IonFabButton>}
          { !triedIt && <IonFabButton size="small"><IonIcon icon={squareOutline}/></IonFabButton> } 

          <IonNote>Description</IonNote>
          <IonLabel>{text}</IonLabel>
          <IonNote>Likes</IonNote>
          <IonLabel class="label">{likes}</IonLabel>
          <div className="flexInlineContainer">
          <IonFabButton size="small" onClick={addLike}>
            <IonIcon icon={thumbsUp} />
          </IonFabButton>
          </div>
          <IonNote>Date</IonNote>
          <IonLabel>{date.toDateString()}</IonLabel>
          <div className="flexInlineContainer">
          <IonFabButton size="small" >
            <IonIcon icon={buildOutline} />
          </IonFabButton>
          </div>
          <div className="flexInlineContainer">
          <IonFabButton size="small">
            <IonIcon icon={trashBinOutline} />
          </IonFabButton>
          </div>
        </IonItem>

  );
};

export default Recipe;
