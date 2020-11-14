import React, { useCallback, useContext, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import { getLogger } from '../../core/logger';
import RecipeProps from '../list/RecipeProps';
import { createItem, deleteItem, getItems, newWebSocket, updateItem } from './recipeApi';
import { AuthContext } from '../auth/authProvider';

const log = getLogger('RecipeProvider');

type SaveRecipeFn = (recipe: RecipeProps) => Promise<any>;
type DeleteRecipeFn = (id: string) => Promise<any>;

export interface RecipesState {
  recipes?: RecipeProps[],
  fetching: boolean,
  fetchingError?: Error | null,
  saving: boolean,
  savingError?: Error | null,
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
};

const FETCH_RECIPES_STARTED = 'FETCH_RECIPES_STARTED';
const FETCH_RECIPES_SUCCEEDED = 'FETCH_RECIPES_SUCCEEDED';
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
        return { ...state, recipes: payload.recipes, fetching: false };
      case FETCH_RECIPES_FAILED:
        return { ...state, fetchingError: payload.error, fetching: false };

      case SAVE_RECIPE_STARTED:
        return { ...state, savingError: null, saving: true };
      case SAVE_RECIPE_SUCCEEDED:
        const recipes = [...(state.recipes || [])];
        //log(payload.recipe)
        const recipe = payload.recipe;
        const index = recipes.findIndex(it => it._id == recipe._id);
        //log(index)
        console.log(recipe)
        if (index === -1) {
          
          recipes.splice(0, 0, recipe);
        } else {
          recipes[index] = recipe;
        }
        let recipes3: RecipeProps[] = [];
        recipes.forEach(x=>recipes3.push(x));
        log(recipes3);
        return { ...state, recipes:recipes3, saving: false };
      case SAVE_RECIPE_FAILED:
        return { ...state, savingError: payload.error, saving: false };

      case DELETE_RECIPE_STARTED:
        return { ...state, fetching: true, fetchingError: null };
      case DELETE_RECIPE_SUCCEEDED:
        const recipes1 = [...(state.recipes || [])];
        const recipe1 = payload.recipe;
        
        const index1 = recipes1.findIndex(it => it._id == recipe1._id);
        //log(index1);
        //log(recipe1);
        recipes1.splice(index1, 1);
        return { ...state, recipes:recipes1, saving: false };
      case DELETE_RECIPE_FAILED:
        return { ...state, fetchingError: payload.error, fetching: false };
      default:
        return state;
    }
  };

export const RecipeContext = React.createContext<RecipesState>(initialState);

interface ItemProviderProps {
  children: PropTypes.ReactNodeLike,
}

export const RecipesProvider: React.FC<ItemProviderProps> = ({ children }) => {
  const { token } = useContext(AuthContext);
  const [state, dispatch] = useReducer(reducer, initialState);
  const { recipes, fetching, fetchingError, saving, savingError } = state;
  useEffect(getItemsEffect, [token]);
  useEffect(wsEffect, [token]);
  const saveRecipe = useCallback<SaveRecipeFn>(saveRecipeCallback, [token]);
  const deleteRecipe = useCallback<DeleteRecipeFn>(deleteRecipeCallback, [token]);

  const value = { recipes, fetching, fetchingError, saving, savingError, saveRecipe: saveRecipe, deleteRecipe };
  
  //log(value);
  return (
    <RecipeContext.Provider value={value}>
      {children}
    </RecipeContext.Provider>
  );

  function getItemsEffect() {
    let canceled = false;
    fetchItems();
    return () => {
      canceled = true;
    }

    async function fetchItems() {
      if (!token?.trim()) {
        return;
      }
      try {
        log('fetchItems started');
        dispatch({ type: FETCH_RECIPES_STARTED });
        const recipes = await getItems(token);
        log('fetchItems succeeded');
        if (!canceled) {
          dispatch({ type: FETCH_RECIPES_SUCCEEDED, payload: { recipes } });
        }
      } catch (error) {
        log('fetchItems failed');
        dispatch({ type: FETCH_RECIPES_FAILED, payload: { error } });
      }
    }
  }

  async function saveRecipeCallback(recipe: RecipeProps) {
    try {
      log('saveRecipe started');
      dispatch({ type: SAVE_RECIPE_STARTED });
      //log(recipe)
      const savedRecipe = await (recipe._id ? updateItem(token, recipe) : createItem(token, recipe));
      log('saveRecipe succeeded');
      dispatch({ type: SAVE_RECIPE_SUCCEEDED, payload: { recipe: savedRecipe } });
    } catch (error) {
      log('saveRecipe failed');
      dispatch({ type: SAVE_RECIPE_FAILED, payload: { error } });
    }
  }

  async function deleteRecipeCallback(id: string) {
    try {
      log('deleteRecipe started');
      dispatch({ type: DELETE_RECIPE_STARTED });
      const deletedRecipe = await (deleteItem(token, id));
      //log("-----------")
      //log(deletedRecipe);
      
      log('deleteRecipe succeeded');
      dispatch({ type: DELETE_RECIPE_SUCCEEDED, payload: { recipe: deletedRecipe } });
    } catch (error) {
      log('deleteRecipe failed');
      dispatch({ type: DELETE_RECIPE_FAILED, payload: { error } });
    }
  }


  function wsEffect() {
    let canceled = false;
    log('wsEffect - connecting');
    let closeWebSocket: () => void;
    if (token?.trim()) {
      closeWebSocket = newWebSocket(token, message => {
        if (canceled) {
          return;
        }
        const { event, payload: recipe } = message;
        log(`ws message, recipe ${event}`);
        if (event === 'created' || event === 'updated') {
          dispatch({ type: SAVE_RECIPE_SUCCEEDED, payload: { recipe } });
        }
      });
    }
    return () => {
      log('wsEffect - disconnecting');
      canceled = true;
      closeWebSocket?.();
    }
  }
};
