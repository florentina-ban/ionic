import axios from 'axios';
import { getLogger } from '.';
import RecipeProps from '../list/RecipeProps';

const log = getLogger('recipeApi');

const baseUrl = 'localhost:3000';
const recipeUrl = `http://${baseUrl}/recipe`;

interface ResponseProps<T> {
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

export const getItems: () => Promise<RecipeProps[]> = () => {
  return withLogs(axios.get(recipeUrl, config), 'getItems');
}

export const createItem: (recipe: RecipeProps) => Promise<RecipeProps[]> = recipe => {
  return withLogs(axios.post(recipeUrl, recipe, config), 'createItem');
}

export const updateItem: (recipe: RecipeProps) => Promise<RecipeProps[]> = recipe => {
  return withLogs(axios.put(`${recipeUrl}/${recipe.id}`, recipe, config), 'updateItem');
}
export const deleteItem: (id: string) => Promise<RecipeProps> = id => {
  return withLogs(axios.delete(`${recipeUrl}/${id}`, config), 'deleteItem');
}

interface MessageData {
  event: string;
  payload: {
    recipe: RecipeProps;
  };
}

export const newWebSocket = (onMessage: (data: MessageData) => void) => {
  const ws = new WebSocket(`ws://${baseUrl}`)
  ws.onopen = () => {
    log('web socket onopen');
  };
  ws.onclose = () => {
    log('web socket onclose');
  };
  ws.onerror = error => {
    log('web socket onerror', error);
  };
  ws.onmessage = messageEvent => {
    log('web socket onmessage');
    onMessage(JSON.parse(messageEvent.data));
  };
  return () => {
    ws.close();
  }
}
