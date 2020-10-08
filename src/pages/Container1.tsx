import React, { useState } from 'react';
import { IonCard, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonLabel, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import RecipeList from '../components/RecipeList';
import EditRecipe from '../components/EditRecipe';


const Container1: React.FC = () =>  {
  
  var id1 =1;
  var likes1 = 1; 
    return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Cool Recipies App</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>  
          <RecipeList />    
          <EditRecipe id={id1} text='text' name='name' likes={likes1} /> 
      </IonContent>
    </IonPage>
    );
}
export default Container1;