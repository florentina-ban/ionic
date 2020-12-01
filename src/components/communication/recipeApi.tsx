import axios from 'axios';
import { getLogger } from '../../core/logger';
import { authConfig } from '../auth/authApi';
import RecipeProps from '../list/RecipeProps';

const log = getLogger('recipeApi');
export const baseUrl = '192.168.100.2:3000';

const recipeUrl = `http://${baseUrl}/api/recipe`;

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


export const getItems: (token: string) => Promise<RecipeProps[]> = (token) => {
  return withLogs(axios.get(recipeUrl, authConfig(token)), 'getItems');
}

export const createItem: (token: string, recipe: RecipeProps) => Promise<RecipeProps[]> = (token, recipe) => {
  return withLogs(axios.post(recipeUrl, recipe, authConfig(token)), 'createItem');
}

export const updateItem: (token:string, recipe: RecipeProps) => Promise<RecipeProps[]> = (token, recipe) => {
  return withLogs(axios.put(`${recipeUrl}/${recipe._id}`, recipe, authConfig(token)), 'updateItem');
}
export const deleteItem: (token: string, id: string) => Promise<RecipeProps> = (token, id) => {
  return withLogs(axios.delete(`${recipeUrl}/${id}`, authConfig(token)), 'deleteItem');
}

interface MessageData {
  event: string;
  payload: {
    recipe: RecipeProps;
  };
}

export const newWebSocket = (token: string, onMessage: (data: MessageData) => void) => {
  const ws = new WebSocket(`ws://${baseUrl}`);
  ws.onopen = () => {
    log('web socket onopen');
    ws.send(JSON.stringify({ type: 'authorization', payload: { token } }));
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
