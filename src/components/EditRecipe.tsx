import React, { useContext, useEffect, useState } from 'react';
import { IonCard, IonCardContent, IonCardTitle, IonCheckbox, IonContent, IonDatetime, IonFabButton, IonHeader, IonIcon, IonInput, IonItem, IonNote, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './editRecipe.css';
import { getLogger } from '../core';
import RecipeIngredients from './RecipeIngredients';
import RecipeProps from '../interfaces/RecipeProps';
import RecipeIngredientProps from '../interfaces/RecipeIngredientProps';
import { checkmarkDone, closeCircleOutline } from 'ionicons/icons';
import { IngredientsContext } from './ItemProvider';
import { RecipesContext } from './RecipesProvider';
import { RouteComponentProps } from 'react-router';

interface RecipeEditProps extends RouteComponentProps<{
    id?: string;
  }> {}

const EditRecipe: React.FC<RecipeEditProps> = ({history, match}) =>  {

const logger = getLogger("editRecipe");
const { items } = useContext(IngredientsContext);
const { recipes, saveRecipe } = useContext(RecipesContext);
const [currentRecipe, setRecipe] = useState<RecipeProps>();
// const [id, setId ] =useState(0);
// const [text, setText ] =useState("");
// const [origin, setOrigin ] =useState("");
// const [triedIt, setTriedIt ] =useState(false);
// const [recipeIngredients, setIngredients ] = useState<RecipeIngredientProps[]>();
 const [date, setDate ] =useState(new Date());
// const [name, setName ] =useState("");
// const [likes, setLikes ] = useState(0);

 useEffect(() => {
    logger('useEffect');
    const routeId = match.params.id || '';
    var currentRecipe = recipes?.find(it => it.id === +routeId); 
    if (!currentRecipe){
        currentRecipe = {id: 0, name: '',origin: '', text: '',date: new Date('01-01-2020'), likes: 0, triedIt: false, recipeIngredients: []};
        setDate(new Date('01-01-2020'));
    }
    setRecipe(currentRecipe);
  }, [match.params.id, recipes]);
  
  const emptyingrList: RecipeIngredientProps[] = [];
    
const cancelEdit = () =>{
    history.push('/home');    
}
const onSaveRecipe = () => {
    const editedRecipe = currentRecipe;
    logger(editedRecipe);
    if (editedRecipe)
        saveRecipe && saveRecipe(editedRecipe).then(() => history.goBack());
}

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar  color="tertiary">
                <IonTitle>Cool Recipies App</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>     
                <IonCard id="editRecipe">
                    <IonCardTitle class="cardTitle">Recipe</IonCardTitle>
                    <IonCardContent id="cardContent">   
                         <IonItem key="name">
                            <IonNote>Name: </IonNote>
                            <IonInput class="textRight" slot="end" value={currentRecipe?.name} onIonChange={e => {
                                if (currentRecipe)  
                                    currentRecipe.name = e.detail.value?.toString() || "";
                                setRecipe(currentRecipe);
                               
                                } }/>
                        </IonItem>      
                        <IonItem key="origin">
                            <IonNote>Origin: </IonNote>
                            <IonInput class="textRight" slot="end" value={currentRecipe?.origin} onIonChange={e => {
                                if (currentRecipe)  
                                    currentRecipe.origin = e.detail.value?.toString() || "";
                                setRecipe(currentRecipe);
                                
                                } }/>
                        </IonItem>     
                        <IonItem key="text">
                            <IonNote>Description: </IonNote>
                            <IonInput class="textRight" slot="end" value={currentRecipe?.text} onIonChange={e => {
                                if (currentRecipe)  
                                    currentRecipe.text = e.detail.value?.toString() || "";
                                setRecipe(currentRecipe);
                               
                                } }/>
                        </IonItem>                      
                        <IonItem key="likes">
                            <IonNote>Likes: </IonNote>
                            <IonInput class="textRight" slot="end" value={currentRecipe?.likes} onIonChange={e => {
                                if (currentRecipe && e.detail.value)
                                    currentRecipe.likes = Number(e.detail.value);
                                setRecipe(currentRecipe);
                                
                                } }/>
                        </IonItem>
                        <IonItem key="triedIt">
                            <IonNote>Tried it: </IonNote>
                            <IonCheckbox color="tertiary" slot="end" checked={currentRecipe?.triedIt} onIonChange={e => {
                                if (currentRecipe) 
                                    currentRecipe.triedIt = e.detail.value.checked;
                                setRecipe(currentRecipe);
                             
                                } }/>
                        </IonItem>
                        <IonItem key="date">
                            <IonNote>Date: </IonNote>
                            <IonDatetime slot="end" displayFormat="DD MM YYYY" placeholder="Select Date" value={date.toDateString()}
                            onIonChange={e => {
                                if (currentRecipe && e.detail.value)
                                    currentRecipe.date = new Date(e.detail.value.toString());
                                setRecipe(currentRecipe);
                                
                            }}> </IonDatetime>
                        </IonItem> 
                         <IonItem>                    
                            <RecipeIngredients recipeIngredients={currentRecipe?.recipeIngredients? currentRecipe?.recipeIngredients : emptyingrList}></RecipeIngredients>  
                        </IonItem>
                        <div key="ButtonItem" id="buttonItem">
                            <IonFabButton size="small" color="tertiary" onClick={cancelEdit}><IonIcon icon={closeCircleOutline}></IonIcon></IonFabButton>
                            <IonFabButton size="small" color="tertiary"><IonIcon icon={checkmarkDone} onClick={onSaveRecipe}></IonIcon></IonFabButton>
                        </div>              
                    </IonCardContent>
                </IonCard>
            </IonContent>
         </IonPage>     
    );
}
export default EditRecipe;;