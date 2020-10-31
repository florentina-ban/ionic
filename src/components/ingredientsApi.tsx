import axios from 'axios';
import { getLogger } from '../core';
import IngredientProps from "../interfaces/IngredientProp";
import RecipeProps from '../interfaces/RecipeProps';

const log = getLogger('ingredientsApi');

const baseUrl = 'localhost:44302';
const ingredientsUrl = `https://${baseUrl}/api/Ingredient`;
const recipesUrl = `https://${baseUrl}/api/Ingredient/recipes`;

export interface ResponseProps<T> {
  data: T;
}

function withLogs<T>(promise: Promise<ResponseProps<T>>, fnName: string): Promise<T> {
  log(`${fnName} - started`);
  return promise
    .then(res => {
      log(`${fnName} - succeeded`);
      return Promise.resolve(res.data);
    })
    .catch(err => {
      log(`${fnName} - failed`);
      return Promise.reject(err);
    });
}

const config = {
  headers: {
    'Content-Type': 'application/json'
  }
};

export const getItems: () => Promise<IngredientProps[]> = () => {
  log("inside ingredientApi");
  return withLogs(axios.get(ingredientsUrl, config), 'getItems');
}

export const getRecipes: () => Promise<RecipeProps[]> = () => {
  log("inside ingredientApi");
  return withLogs(axios.get(recipesUrl, config), 'getRecipes');
}

/*
export const createItem: (item: ItemProps) => Promise<ItemProps[]> = item => {
  return withLogs(axios.post(itemUrl, item, config), 'createItem');
}

export const updateItem: (item: ItemProps) => Promise<ItemProps[]> = item => {
  return withLogs(axios.put(`${itemUrl}/${item.id}`, item, config), 'updateItem');
}
*/
interface MessageData {
  event: string;
  payload: {
    ingredient: IngredientProps;
  };
}

export const newWebSocket = (onMessage: (data: MessageData) => void) => {
  const ws = new WebSocket(`ws://${ingredientsUrl}`)
  ws.onopen = () => {
    log('web socket onopen');
  };
  ws.onclose = () => {
    log('web socket onclose');
  };
  ws.onerror = error => {
    log('web socket onerror');
  };
  ws.onmessage = messageEvent => {
    log('web socket onmessage');
    onMessage(JSON.parse(messageEvent.data));
  };
  return () => {
    ws.close();
  }
}
interface MessageDataRecipe {
  event: string;
  payload: {
    recipe: RecipeProps;
  };
}

export const newWebSocketR = (onMessage: (data: MessageDataRecipe) => void) => {
  const ws = new WebSocket(`ws://${recipesUrl}`)
  ws.onopen = () => {
    log('web socket onopen');
  };
  ws.onclose = () => {
    log('web socket onclose');
  };
  ws.onerror = error => {
    log('web socket onerror');
  };
  ws.onmessage = messageEvent => {
    log('web socket onmessage');
    onMessage(JSON.parse(messageEvent.data));
  };
  return () => {
    ws.close();
  }
}
