import React, { useContext } from 'react';
import { IonCard, IonCardContent, IonCardTitle, IonContent, IonFabButton, IonHeader, IonIcon, IonList, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import Recipe from './Recipe';
import './recipeList.css';
import { RouteComponentProps } from 'react-router';
import RecipeProps from './RecipeProps';
import { getLogger } from '../../core/logger';
import { add, logOut } from 'ionicons/icons';
import { RecipeContext } from '../communication/RecipesProvider';
import { AuthContext } from '../auth/authProvider';

const RecipeList: React.FC<RouteComponentProps> = ({history, match}) =>  {
    const logger = getLogger("RecipeList");
    const { recipes, saveRecipe: saveRecipe, deleteRecipe } = useContext(RecipeContext);
    const { logout } = useContext(AuthContext);

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
                    <IonCardContent >
                        <IonList >
                        {recipes && recipes.map( ({_id: id, description, name, likes, origin, date, triedIt}) => 
                        <Recipe key={id} _id={id} origin={origin} date={date} triedIt={triedIt} name={name} description={description} likes={likes}
                        editRecipe={id => history.push(`/item/${id}`)}
                        saveRecipep={saveRecipeIns} 
                        removeRecipe={removeRecipeIns}
                        />
                        )} 
                        </IonList>
                        <div id ="buttonsDiv">
                            <IonFabButton id="addButton" color="tertiary" onClick={logOutFunc}> <IonIcon icon={logOut}></IonIcon></IonFabButton>                     
                            <IonFabButton id="addButton" color="tertiary" onClick={addRecipe}> <IonIcon icon={add}></IonIcon></IonFabButton>                     
                        </div>
                    </IonCardContent>
                </IonCard>
            </IonContent>
        </IonPage>
    );
}
export default RecipeList;