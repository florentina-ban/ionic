import React, { useContext, useEffect, useState } from 'react';
import { IonCard, IonCardContent, IonCardTitle, IonCheckbox, IonContent, IonFabButton, IonHeader, IonIcon, IonInfiniteScroll, IonInfiniteScrollContent, IonItem, IonNote, IonPage, IonSearchbar, IonTitle, IonToolbar } from '@ionic/react';
import Recipe from './Recipe';
import './recipeList.css';
import { RouteComponentProps } from 'react-router';
import RecipeProps from './RecipeProps';
import { getLogger } from '../../core/logger';
import { add, logOut, sync } from 'ionicons/icons';
import { RecipeContext } from '../communication/RecipesProvider';
import { AuthContext } from '../auth/authProvider';
import { addToStorage } from '../localStorage/localStorageApi';
import { useAppState } from '../communication/useAppState'
import { useNetwork } from '../communication/useNetwork';
import { useBackgroundTask } from '../communication/useBackgroundTask';

const RecipeList: React.FC<RouteComponentProps> = ({history, match}) =>  {
    const logger = getLogger("RecipeList");
   // const { appState } = useAppState();
    const { networkStatus } = useNetwork();
    const { recipes, saveRecipe, deleteRecipe } = useContext(RecipeContext);
    const { logout } = useContext(AuthContext);
    const [ searchText, setSearchText ] = useState("");
    const [ likesCheck, setLikesCheck ] = useState(false);
    const [ disableInfiniteScroll, setDisableInfiniteScroll ] = useState<boolean>(false);
    const [ position , setPosition] = useState(0);
    const [ displayed , setDisplayed] = useState<RecipeProps[]>([]);
    addToStorage("displayed",displayed);

    useBackgroundTask(() => new Promise(resolve => {
        console.log('My Background Task');
        resolve();
      }));

    const firstCall = () => {
        setDisplayed([])
        setPosition(0)   
        setDisableInfiniteScroll(false) 
    }

    if (recipes && position===0){
        //console.log("in primul apel")
        setDisplayed([...recipes.slice(0,4)]);
        setPosition(4);   
    }

    useEffect(firstCall, [recipes]);

    async function searchNext($event: CustomEvent<void>){     
        if(recipes && position < recipes.length) {
            setDisplayed([...displayed, ...recipes.slice(position, position + 3)]);
            setPosition(position + 4);
            console.log(position);
        } else {
            setDisableInfiniteScroll(true);
        }
        ($event.target as HTMLIonInfiniteScrollElement).complete().then();
    }
    
    const addRecipe = () => {
        history.push("/item")
    }

    const removeRecipeIns = (id: string) => {    
        if (recipes && id && deleteRecipe){
        deleteRecipe(id);
        }
    }

    const saveRecipeIns = (recipe: RecipeProps) => {
        if (recipes && recipe && saveRecipe){
        saveRecipe(recipe);
        }
    }

    const logOutFunc = () =>  {
        logout && logout();
        history.push("/login")
    }
    //console.log("in recipe list"+ displayed?.length);

    return (  
        <IonPage>
            <IonHeader>
                <IonToolbar color="tertiary">
                  <IonTitle>Cool Recipies App</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent color="light">
              
                <IonCard id="recipeList">
                    <IonCardTitle class="cardTitle">My recipes</IonCardTitle>
                    
                    <IonCardContent id="cardContent">
                    <IonCheckbox id="networkCheck" checked={networkStatus.connected}/>
                    <IonNote>NetWork connection</IonNote>
                        <IonSearchbar value={searchText} onIonChange={e => {
                            logger(e.detail.value);
                            logger(e.detail.value?.includes('a'));
                            setSearchText(e.detail.value!)}
                            }></IonSearchbar>
                        
                        <IonItem id="filterDiv">
                            <IonCheckbox id="filterCheck" checked={likesCheck} onIonChange={e => {setLikesCheck(e.detail.checked) }}/>
                            <IonNote id="filterNote">Show what people like</IonNote>
                        </IonItem>

                        <div id ="buttonsDiv">
                            <IonFabButton id="addButton" color="tertiary" onClick={logOutFunc}> <IonIcon icon={logOut}></IonIcon></IonFabButton>                     
                            <IonFabButton id="addButton" color="tertiary" onClick={addRecipe}> <IonIcon icon={add}></IonIcon></IonFabButton>                     
                        </div>     
                        <div id="contentDiv">             
                        {(!likesCheck) && recipes && searchText.trim().length>0 && displayed.filter(rep=>{ return rep.name.includes(searchText.trim())}).map( ({_id: id, description, name, likes, origin, date, triedIt}) => 
                        <Recipe key={id} _id={id} origin={origin} date={date} triedIt={triedIt} name={name} description={description} likes={likes}
                        editRecipe={id => history.push(`/item/${id}`)}
                        saveRecipep={saveRecipeIns} 
                        removeRecipe={removeRecipeIns}
                        />
                        )} 
                        {(!likesCheck) && recipes && searchText.trim().length===0 && displayed.map( ({_id: id, description, name, likes, origin, date, triedIt}) => 
                        <Recipe key={id} _id={id} origin={origin} date={date} triedIt={triedIt} name={name} description={description} likes={likes}
                        editRecipe={id => history.push(`/item/${id}`)}
                        saveRecipep={saveRecipeIns} 
                        removeRecipe={removeRecipeIns}
                        />
                        )}
                        { likesCheck && recipes && searchText.trim().length===0 && displayed.filter(rep=>{ return rep.likes>0 }).map( ({_id: id, description, name, likes, origin, date, triedIt}) => 
                        <Recipe key={id} _id={id} origin={origin} date={date} triedIt={triedIt} name={name} description={description} likes={likes}
                        editRecipe={id => history.push(`/item/${id}`)}
                        saveRecipep={saveRecipeIns} 
                        removeRecipe={removeRecipeIns}
                        />
                        )}  
                        { likesCheck && recipes && searchText.trim().length>0 && displayed.filter(rep=>{ return ( rep.likes>0 && rep.name.includes(searchText.trim())) }).map( ({_id: id, description, name, likes, origin, date, triedIt}) => 
                        <Recipe key={id} _id={id} origin={origin} date={date} triedIt={triedIt} name={name} description={description} likes={likes}
                        editRecipe={id => history.push(`/item/${id}`)}
                        saveRecipep={saveRecipeIns} 
                        removeRecipe={removeRecipeIns}
                        />
                        )} 
                        </div> 
                        <IonInfiniteScroll
                            threshold="15px"
                            disabled={disableInfiniteScroll}
                            onIonInfinite={(e: CustomEvent<void>) => {
                                searchNext(e).then();
                            }}>
                            <IonInfiniteScrollContent loadingText="Loading more products..."/>
                        </IonInfiniteScroll>
                                               
                    </IonCardContent>
                </IonCard>
            </IonContent>
        </IonPage>
    );
}
export default RecipeList;