import React, { useContext, useEffect, useState } from 'react';
import { IonCard, IonCardContent, IonCardTitle, IonCheckbox, IonContent, IonDatetime, IonFabButton, IonHeader, IonIcon, IonInput, IonItem, IonLoading, IonNote, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './editRecipe.css';
import { getLogger } from '../communication';
import RecipeProps from '../list/RecipeProps';
import { checkmarkDone, closeCircleOutline } from 'ionicons/icons';
import { RecipeContext } from '../communication/RecipesProvider';
import { RouteComponentProps } from 'react-router';

interface RecipeEditProps extends RouteComponentProps<{
    id?: string;
  }> {}

const EditRecipe: React.FC<RecipeEditProps> = ({history, match}) =>  {

    const logger = getLogger("editRecipe");
    const { recipes, saving, savingError, saveRecipe } = useContext(RecipeContext);
    const [currentRecipe, setRecipe] = useState<RecipeProps>();
    const [description, setDescription ] =useState("");
    const [origin, setOrigin ] =useState("");
    const [triedIt, setTriedIt ] =useState(false);
    const [date, setDate ] =useState(new Date());
    const [name, setName ] =useState("");
    const [likes, setLikes ] = useState(0);
    const [id, setId] = useState<string>();

 useEffect(() => {
    logger('useEffect');
    const routeId = match.params.id || '';
    var currentRecipe = recipes?.find(it => it.id == routeId); 
    logger(currentRecipe);
    setRecipe(currentRecipe);
    if (currentRecipe){
        setId(currentRecipe.id);
        setDescription(currentRecipe.description);
        setOrigin(currentRecipe.origin);
        setName(currentRecipe.name);
        setLikes(currentRecipe.likes);
        setTriedIt(currentRecipe.triedIt);
        setDate(currentRecipe.date);
    }
  }, [match.params.id, recipes]);
     
const cancelEdit = () =>{
    history.push('/home');    
}
const onSaveRecipe = () => {
    const editedRecipe = currentRecipe ? { ...currentRecipe, description, name, origin, date, triedIt, likes } : { description, name, origin, date, triedIt, likes };
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
                            <IonInput class="textRight" slot="end" value={name} onIonChange={e => 
                               
                                    setName(e.detail.value || '')}/>
                        </IonItem>      
                        <IonItem key="origin">
                            <IonNote>Origin: </IonNote>
                            <IonInput class="textRight" slot="end" value={origin} onIonChange={e => 
                                setOrigin(e.detail.value || '')}/>
                        </IonItem>     
                        <IonItem key="text">
                            <IonNote>Description: </IonNote>
                            <IonInput class="textRight" slot="end" value={description} onIonChange={e =>
                                setDescription(e.detail.value || '')}/>
                        </IonItem>                      
                        <IonItem key="likes">
                            <IonNote>Likes: </IonNote>
                            <IonInput class="textRight" slot="end" value={likes} onIonChange={e => {
                                if (e.detail.value)
                                    setLikes(parseInt(e.detail.value));
                            }}/>
                        </IonItem>
                        <IonItem key="triedIt">
                            <IonNote>Tried it: </IonNote>
                            <IonCheckbox color="tertiary" slot="end" checked={triedIt} onIonChange={e => {
                               setTriedIt(e.detail.checked || false);
                                } }/>
                        </IonItem>
                         <IonItem key="date">
                            <IonNote>Date: </IonNote>
                            <IonDatetime slot="end" displayFormat="DD MM YYYY" placeholder="Select Date" value={(new Date(date)).toDateString()}
                            onIonChange={e => {
                                if (e.detail.value)
                                    setDate(new Date(e.detail.value));
                                else
                                    setDate(new Date);
                            }}> </IonDatetime>
                        </IonItem>  
                        
                        <IonLoading isOpen={saving} />
                            {savingError && (
                            <div>{savingError.message || 'Failed to save item'}</div>
                            )}

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