import React, { useState } from 'react';
import { IonCard, IonCardContent, IonCardTitle, IonContent, IonHeader, IonInput, IonItem, IonItemDivider, IonLabel, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './recipeList.css';
import RecipePropsRoute from '../interfaces/RecipePropsRoute';
import { getLogger } from '../core';

const recipeProvider = (id: number) => {
    return (id === 1) ? { id: 1, name: "Banana bread",origin: "Romania", triedIt:true, date: new Date('2020-10-11'),  text: "descriptionBanana", likes: 2} :
        (id === 2) ? { id: 2, name: "Pizza", origin: "Romania", triedIt:true, date: new Date('2020-10-11'), text: "descriptionPizza", likes: 2} :
        (id === 3) ? { id: 3, name: "Icecream", origin: "Romania", triedIt:true, date: new Date('2020-10-11'), text: "descriptionIcecrea", likes: 2} : 
        { id: 4, name: "Chocolate", origin: "Romania", triedIt:true, date: new Date('2020-10-11'), text: "descriptionChocolate", likes: 20};
}
const logger = getLogger("editRecipe");

const EditRecipe: React.FC<RecipePropsRoute> = ({history, match}) =>  {
logger("orice");
    const currentRecipe = recipeProvider(+match.params.id);
    const [state, setState] = useState(currentRecipe);
    const { text, name, likes } = currentRecipe;
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                <IonTitle>Cool Recipies App</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>     
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
            </IonContent>
         </IonPage>
        
    );
}
export default EditRecipe;;