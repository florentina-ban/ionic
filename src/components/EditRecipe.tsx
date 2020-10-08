import React, { useState } from 'react';
import { IonCard, IonCardContent, IonCardTitle, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonInput, IonItem, IonItemDivider, IonLabel, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './recipeList.css';
import RecipeProps from '../interfaces/RecipeProps';


const EditRecipe: React.FC<RecipeProps> = (props) =>  {
    
    const [state, setRecipes] = useState(props);

    const { id, text, name, likes } = state;
    return (
        <IonCard id="editRecipe">
            <IonCardContent>
                <IonCardTitle>My Recipe</IonCardTitle>
                <IonItemDivider></IonItemDivider>
                <IonItem>
                    <IonLabel>Name: </IonLabel>
                    <IonInput value={name} />
                </IonItem> 
                <IonItem>
                    <IonLabel>Description: </IonLabel>
                    <IonInput value={text} />
                </IonItem>
                <IonItem>
                    <IonLabel>Likes: </IonLabel>
                    <IonInput value={likes} />
                </IonItem>
            </IonCardContent>
         </IonCard>
    );
}
export default EditRecipe;;