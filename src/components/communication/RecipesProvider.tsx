import React, { useCallback, useContext, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import { getLogger } from '../../core/logger';
import RecipeProps from '../list/RecipeProps';
import { createItem, deleteItem, getItems, newWebSocket, updateItem } from './recipeApi';
import { AuthContext } from '../auth/authProvider';
import { addToStorage, getFromStorage, getListFromStorage, clear as clearStorage } from '../localStorage/localStorageApi';
import { useNetwork } from './useNetwork';

const log = getLogger('RecipeProvider');


type SaveRecipeFn = (recipe: RecipeProps) => Promise<any>;
type DeleteRecipeFn = (id: string) => Promise<any>;

export interface RecipesState {
  recipes?: RecipeProps[],
  fetching: boolean,
  fetchingError?: Error | null,
  saving: boolean,
  mySavErr?: Error | null,
  saveRecipe?: SaveRecipeFn,
  deleteRecipe?: DeleteRecipeFn
}

interface ActionProps {
  type: string,
  payload?: any,
}

const initialState: RecipesState = {
  fetching: false,
  saving: false,
  mySavErr: null
};

const FETCH_RECIPES_STARTED = 'FETCH_RECIPES_STARTED';
const FETCH_RECIPES_SUCCEEDED = 'FETCH_RECIPES_SUCCEEDED';
const FETCH_RECIPES_SUCCEEDED_STORAGE = 'FETCH_RECIPES_SUCCEEDED_STORAGE';
const FETCH_RECIPES_FAILED = 'FETCH_RECIPES_FAILED';
const SAVE_RECIPE_STARTED = 'SAVE_RECIPE_STARTED';
const SAVE_RECIPE_SUCCEEDED = 'SAVE_RECIPE_SUCCEEDED';
const SAVE_RECIPE_FAILED = 'SAVE_RECIPE_FAILED';
const DELETE_RECIPE_STARTED = 'DELETE_RECIPE_STARTED';
const DELETE_RECIPE_SUCCEEDED = 'DELETE_RECIPE_SUCCEEDED';
const DELETE_RECIPE_FAILED = 'DELETE_RECIPE_FAILED';

const reducer: (state: RecipesState, action: ActionProps) => RecipesState =
  (state, { type, payload }) => {
    switch (type) {
      case FETCH_RECIPES_STARTED:
        return { ...state, fetching: true, fetchingError: null };
      case FETCH_RECIPES_SUCCEEDED:
        log("in reducer "+ payload.recipes)
        addToStorage("recipes", payload.recipes);
        return { ...state, recipes: payload.recipes, fetching: false };
      case FETCH_RECIPES_SUCCEEDED_STORAGE:
          addToStorage("recipes", payload.recipes);
          return { ...state, recipes: payload.recipes, fetching: false };
      case FETCH_RECIPES_FAILED:
        return { ...state, fetchingError: payload.error, fetching: false };

      case SAVE_RECIPE_STARTED:
        return { ...state, mySavErr: null, saving: true };
      case SAVE_RECIPE_SUCCEEDED:
        const recipes = [...(state.recipes || [])];
        const recipe = payload.recipe;
        const index = recipes.findIndex(it => it._id === recipe._id);
        if (index === -1) {     
          recipes.splice(0, 0, recipe);
        } else {
          recipes[index] = recipe;
        }
        let recipes3: RecipeProps[] = [];
        recipes.forEach(x=>recipes3.push(x));
        log(recipes3);
        alert("remote storage updated")
        addToStorage("recipes", recipes3);
        return { ...state, recipes:recipes3, saving: false };
      case SAVE_RECIPE_FAILED:
        const { error, recipe_original } =  payload.param
    

        log(error.message)
        const recipes2 = [...(state.recipes || [])];
        const index2 = recipes2.findIndex(it => it._id === recipe_original._id);
        if (index2 === -1) {     
          recipes2.splice(0, 0, recipe_original);
        } else {
          recipes2[index2] = recipe_original;
        }
        let recipes4: RecipeProps[] = [];
        recipes2.forEach(x=>recipes4.push(x));
        log(recipes4);
        addToStorage("recipes", recipes4);
        alert(error.message)
        return { ...state, recipes: recipes4, mySavErr: error, saving: false };

      case DELETE_RECIPE_STARTED:
        return { ...state, fetching: true, fetchingError: null };
      case DELETE_RECIPE_SUCCEEDED:
        const recipes1 = [...(state.recipes || [])];
        const recipe1 = payload.recipe;
        
        const index1 = recipes1.findIndex(it => it._id === recipe1._id);
        recipes1.splice(index1, 1);
        addToStorage("recipes", recipes1);
        alert("remote storage updated")
        return { ...state, recipes: recipes1, saving: false };
      case DELETE_RECIPE_FAILED:
        const recipes7 = [...(state.recipes || [])];
        const index7 = recipes7.findIndex(it => it._id === payload.id);
        recipes7.splice(index7, 1);
        return { ...state, recipes: recipes7, fetchingError: payload.error, fetching: false };
      default:
        return state;
    }
  };
  //clearStorage();

export const RecipeContext = React.createContext<RecipesState>(initialState);

interface ItemProviderProps {
  children: PropTypes.ReactNodeLike,
}

export const RecipesProvider: React.FC<ItemProviderProps> = ({ children }) => {
  const { token } = useContext(AuthContext);
  const { networkStatus } = useNetwork();
  const  [state, dispatch ] = useReducer(reducer, initialState);
  const { recipes, fetching, fetchingError, saving, mySavErr: mySavingError} = state;
  useEffect(getItemsEffect, [token]);
  useEffect(wsEffect, [token]);
  const saveRecipep = useCallback<SaveRecipeFn>(saveRecipeCallback, [token]);
  const deleteRecipep = useCallback<DeleteRecipeFn>(deleteRecipeCallback, [token]);

  const value = { recipes, fetching, fetchingError, saving, mySavingError, saveRecipe: saveRecipep, deleteRecipe: deleteRecipep };
  
  return (
    <RecipeContext.Provider value={value}>
      {children}
    </RecipeContext.Provider>
  );

  function getItemsEffect() {
    let canceled = false;
    try{
      if (networkStatus.connected)
        fetchItems();
      else
        fetchItemsFromStaroage(); 
    }catch (error){
      log("error: "+ error);
      fetchItemsFromStaroage(); 
    }
    return () => {
      canceled = true;
    }

  async function fetchItemsFromStaroage(){
    log('fetchItems from storage started');
    dispatch({ type: FETCH_RECIPES_STARTED });
    try{
      const myRecip = (await (getListFromStorage('recipes')));
      log("recipes from storage:  " + myRecip)
    
      log('fetchItems succeeded from storage');
      if (!canceled) {
        dispatch({ type: FETCH_RECIPES_SUCCEEDED_STORAGE, payload: { recipes: myRecip } });
      }       
    }catch(error){
      log('fetchItems failed');
      dispatch({ type: FETCH_RECIPES_FAILED, payload: { error } });
    }
  }

    async function fetchItems() {
      if (!token) {
        return;
      }
      try {
        log('fetchItems started');
        dispatch({ type: FETCH_RECIPES_STARTED });
        const recipes = await getItems(token);
          if (!canceled) {
            dispatch({ type: FETCH_RECIPES_SUCCEEDED, payload: { recipes: recipes } });
          return;
          } 
        }catch(err){
          log("error in fetch recipes: "+err)
          fetchItemsFromStaroage()
          //dispatch({type: FETCH_RECIPES_FAILED, payload: { error:err}});
        }
    }
  }

  async function saveRecipeCallback(recipe: RecipeProps) {
    try {
      log('saveRecipe started');
      dispatch({ type: SAVE_RECIPE_STARTED });
      const savedRecipe = await (recipe._id ? updateItem(token, recipe) : createItem(token, recipe));
      log('saveRecipe succeeded');
      //dispatch({ type: SAVE_RECIPE_SUCCEEDED, payload: { recipe: savedRecipe } });
    } catch (error) {
      log('saveRecipe failed');
      var local_data: RecipeProps[] = await(getListFromStorage("local_data"))
      log(local_data)
      if (local_data){
      var index = local_data.findIndex(it => it._id === recipe._id)
      if (recipe._id)
        recipe.location = 2
      else
        recipe.location = 1
      if (index === -1)
        local_data.splice(0,0,recipe)
      else
        local_data[index] = recipe
      }
     else{
      local_data = []
      local_data.splice(0,0,recipe)
     }
      addToStorage("local_data", local_data)
      
      var param = {error : error, recipe_original: recipe}
      dispatch({ type: SAVE_RECIPE_FAILED, payload: { param } });
    }
  }

  async function deleteRecipeCallback(id: string) {
    try {
      log('deleteRecipe started');
      dispatch({ type: DELETE_RECIPE_STARTED });
      const deletedRecipe = await (deleteItem(token, id));      
      log('deleteRecipe succeeded');
      //dispatch({ type: DELETE_RECIPE_SUCCEEDED, payload: { recipe: deletedRecipe } });
    } catch (error) {
      log('deleteRecipe failed');
      var local_data: RecipeProps[] = await(getListFromStorage("local_data"))
      var index = local_data.findIndex(it => it._id === id)
     
      if (index === -1){
        local_data.splice(0,0,{_id: id, name:"", description: "", origin: "",likes:0, triedIt:false, date: new Date(),location:3})
      }
      else{
        local_data[index].location = 3
      }
      addToStorage("local_data", local_data)
      dispatch({ type: DELETE_RECIPE_FAILED, payload: { error, id } });
    }
  }


  function wsEffect() {
    let canceled = false;
    log('wsEffect - connecting');
    let closeWebSocket: () => void;
    if (token) {
      closeWebSocket = newWebSocket(token, message => {
        if (canceled) {
          return;
        }
        const { event, payload: recipe } = message;
        log(`ws message, recipe ${event}`);
        if (event === 'created' || event === 'updated') {
          dispatch({ type: SAVE_RECIPE_SUCCEEDED, payload: { recipe } });
        }
        if (event === 'removed')
          dispatch({type: DELETE_RECIPE_SUCCEEDED, payload: {recipe} });
      });
    }
    return () => {
      log('wsEffect - disconnecting');
      canceled = true;
      closeWebSocket?.();
    }
  }
};
