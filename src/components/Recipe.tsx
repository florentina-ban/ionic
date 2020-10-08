import { IonFabButton, IonIcon, IonItem, IonLabel } from '@ionic/react';
import { stat } from 'fs';
import { thumbsUp } from 'ionicons/icons';
import React, { useState } from 'react';
import RecipeProps from '../interfaces/RecipeProps';


const Recipe: React.FC<RecipeProps> = (props) => {

    const [state, setState] = useState<RecipeProps>(props);

    const addLike = () => {
        const { likes } = state;
        const likeNo = likes + 1;
        setState({...state, likes: likeNo});
    }
    const {name, text, likes} = state;

    const changeSelected = () => {
        
    }
  return (    
    <div>
        <IonItem onClick={changeSelected}>
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
