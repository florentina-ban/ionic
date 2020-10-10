import { IonFabButton, IonIcon, IonItem, IonLabel } from '@ionic/react';
import { thumbsUp } from 'ionicons/icons';
import React, { useState } from 'react';
import RecipePropsExt from '../interfaces/RecipePropsExt';

const Recipe: React.FC<RecipePropsExt> = (props) => {

    const [state, setState] = useState<RecipePropsExt>(props);

    const addLike = () => {
        const { likes } = state;
        const likeNo = likes + 1;
        setState({...state, likes: likeNo});
    }
    const {id, name, text, likes} = state;

    const onEditRecipe = () => {
        const { editRecipe } = state;
        editRecipe(id);
    }
  return (    
    <div>
        <IonItem onClick={onEditRecipe}>
          <IonLabel>{name}</IonLabel>
          <IonLabel>{text}</IonLabel>
          <IonLabel>{likes}</IonLabel>
          <IonFabButton onClick={addLike}>
            <IonIcon icon={thumbsUp} />
          </IonFabButton>
        </IonItem>
  </div>
  );
};

export default Recipe;
