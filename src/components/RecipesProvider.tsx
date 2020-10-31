import React, { useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import { getLogger } from '../core';
import { getRecipes, newWebSocket, newWebSocketR } from './ingredientsApi';
import RecipeProps from '../interfaces/RecipeProps';

const log = getLogger('RecipesProvider');
const initialState: RecipesState = { 
  fetchingR: false,
  savingR: false,
};

//type SaveItemFn = (item: ItemProps) => Promise<any>;

export interface RecipesState {
  recipes?: RecipeProps[],
  fetchingR: boolean,
  fetchingErrorR?: Error | null,
  savingR: boolean,
  savingErrorR?: Error | null,
  //saveItem?: SaveItemFn,
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
        const item = payload.recipe;
        const index = recipes.findIndex(it => it.id === item.id);
        if (index === -1) {
          recipes.splice(0, 0, item);
        } else {
          recipes[index] = item;
        }
        return { ...state, recipes, savingR: false };
      case SAVE_ITEM_FAILED:
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
  const value = { recipes, fetchingR, fetchingErrorR, savingR, savingErrorR };
 
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
  
  
/*
  async function saveItemCallback(item: ItemProps) {
    try {
      log('saveItem started');
      dispatch({ type: SAVE_ITEM_STARTED });
      const savedItem = await (item.id ? updateItem(item) : createItem(item));
      log('saveItem succeeded');
      dispatch({ type: SAVE_ITEM_SUCCEEDED, payload: { item: savedItem } });
    } catch (error) {
      log('saveItem failed');
      dispatch({ type: SAVE_ITEM_FAILED, payload: { error } });
    }
  }
*/
  function wsEffect() {
    let canceled = false;
    log('wsEffect - connecting');
    const closeWebSocket = newWebSocket(message => {
      if (canceled) {
        return;
      }
      const { event, payload: { ingredient }} = message;
      log(`ws message, item ${event}`);
      if (event === 'created' || event === 'updated') {
        dispatch({ type: SAVE_ITEM_SUCCEEDED, payload: { ingredient } });
      }
    });
    return () => {
      log('wsEffect - disconnecting');
      canceled = true;
      closeWebSocket();
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

