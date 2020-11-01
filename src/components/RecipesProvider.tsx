import React, { useCallback, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import { getLogger } from '../core';
import { createRecipe, getRecipes, newWebSocket, newWebSocketR, removeRecipe, updateRecipe } from './ingredientsApi';
import RecipeProps from '../interfaces/RecipeProps';

const log = getLogger('RecipesProvider');
const initialState: RecipesState = { 
  fetchingR: false,
  savingR: false,
};

type SaveItemFn = (item: RecipeProps) => Promise<any>;
type DeleteItemFn = (id: number) => Promise<any>;

export interface RecipesState {
  recipes?: RecipeProps[],
  fetchingR: boolean,
  fetchingErrorR?: Error | null,
  savingR: boolean,
  savingErrorR?: Error | null,
  saveRecipe?: SaveItemFn,
  deleteRecipe?: DeleteItemFn
}

interface ActionProps {
  type: string,
  payload?: any,
}

const FETCH_ITEMS_STARTED = 'FETCH_ITEMS_STARTED';
const FETCH_ITEMS_SUCCEEDED = 'FETCH_ITEMS_SUCCEEDED';
const FETCH_ITEMS_FAILED = 'FETCH_ITEMS_FAILED';
const SAVE_ITEM_STARTED = 'SAVE_ITEM_STARTED';
const SAVE_ITEM_SUCCEEDED = 'SAVE_ITEM_SUCCEEDED';
const SAVE_ITEM_FAILED = 'SAVE_ITEM_FAILED';
const DELETE_ITEM_STARTED = 'DELETE_ITEM_STARTED';
const DELETE_ITEM_SUCCEEDED = 'DELETE_ITEM_SUCCEEDED';
const DELETE_ITEM_FAILED = 'DELETE_ITEM_FAILED';


const reducer: (state: RecipesState, action: ActionProps) => RecipesState =
  (state, { type, payload }) => {
    log("inside reducer");
    switch (type) {
      case FETCH_ITEMS_STARTED:
          log("fetching started");
        return { ...state, fetchingR: true, fetchingErrorR: null };
      case FETCH_ITEMS_SUCCEEDED:
        return { ...state, recipes: payload.recipes, fetchingR: false };
      case FETCH_ITEMS_FAILED:
        return { ...state, fetchingErrorR: payload.error, fetchingR: false };
      case SAVE_ITEM_STARTED:
        return { ...state, savingErrorR: null, savingR: true };
      case SAVE_ITEM_SUCCEEDED:
        const recipes = [...(state.recipes || [])];
        log(recipes);
        const item = payload.recipe;
        log(item);
        const index = recipes.findIndex(it => it.id === item.id);
        if (index === -1) {
          recipes.splice(0, 0, item);
        } else {
          recipes[index] = item;
        }
        return { ...state, recipes, savingR: false };
      case SAVE_ITEM_FAILED:
        return { ...state, savingErrorR: payload.error, savingR: false };
        case DELETE_ITEM_STARTED:
        return { ...state, savingErrorR: null, savingR: true };
      case DELETE_ITEM_SUCCEEDED:
        const recipes2 = payload.recipes;
        log(recipes2);
        return { ...state, recipes:recipes2, savingR: false };
      case DELETE_ITEM_FAILED:
        return { ...state, savingErrorR: payload.error, savingR: false };
      default:
        return state;
    }
  }
  export const RecipesContext = React.createContext<RecipesState>(initialState);

interface RecipeProviderProps {
  children: PropTypes.ReactNodeLike
}


export const RecipesProvider: React.FC<RecipeProviderProps> = ({ children }) => {
  log("inside recipe provider");
  const [state, dispatch] = useReducer(reducer, initialState);
  const { recipes, fetchingR, fetchingErrorR, savingR, savingErrorR } = state;
  useEffect(getItemsEffect, []);
  useEffect(wsEffectR, []);
  const saveRecipe = useCallback<SaveItemFn>(saveItemCallback, []);
  const deleteRecipe = useCallback<DeleteItemFn>(deleteItemCallback, []);
 
  const value = { recipes, fetchingR, fetchingErrorR, savingR, savingErrorR, saveRecipe, deleteRecipe };
 
  log('returns');
  return (
    <RecipesContext.Provider value={value}>
      {children}
    </RecipesContext.Provider>
  );

  function getItemsEffect() {
    let canceled = false;
    fetchItems();
    return () => {
      canceled = true;
    }

    async function fetchItems() {
      try {
        log('fetchrecipes started');
        dispatch({ type: FETCH_ITEMS_STARTED });
        const recipes = await getRecipes();
        log('fetchRecipes succeeded');
        if (!canceled) {
          dispatch({ type: FETCH_ITEMS_SUCCEEDED, payload: { recipes } });
        }
      } catch (error) {
        log('fetchRecipes failed');
        dispatch({ type: FETCH_ITEMS_FAILED, payload: { error } });
      }
    }
  }
  
  
  async function saveItemCallback(item: RecipeProps) {
    try {
      log('saveRecipe started');
      dispatch({ type: SAVE_ITEM_STARTED });
      log("myLog!");
      log(item);
      const recipe = await (item.id!==0 ? updateRecipe(item) : createRecipe(item));
      log('saveRecipe succeeded');
      dispatch({ type: SAVE_ITEM_SUCCEEDED, payload: { recipe } });
    } catch (error) {
      log('saveRecipe failed');
      dispatch({ type: SAVE_ITEM_FAILED, payload: { error } });
    }
  }

  async function deleteItemCallback(id: number) {
    try {
      log('deleteRecipe started');
      dispatch({ type: DELETE_ITEM_STARTED });
      const recipes = await (removeRecipe(id));
      log('deleteRecipe succeeded');
      dispatch({ type: DELETE_ITEM_SUCCEEDED, payload: { recipes } });
    } catch (error) {
      log('deleteRecipe failed');
      dispatch({ type: DELETE_ITEM_FAILED, payload: { error } });
    }
  }

function wsEffectR() {
    let canceled = false;
    log('wsEffectR - connecting');
    const closeWebSocket = newWebSocketR(message => {
        
      if (canceled) {
        return;
      }
      const { event, payload: { recipe }} = message;
      log(`ws message, item ${event}`);
      if (event === 'created' || event === 'updated') {
        dispatch({ type: SAVE_ITEM_SUCCEEDED, payload: { recipe } });
      }
    });
    return () => {
      log('wsEffectR - disconnecting');
      canceled = true;
      closeWebSocket();
    }
  }
};

