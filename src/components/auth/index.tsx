import { getLogger } from "../../core/logger";

const log = getLogger('api');

export interface ResponseProps<T> {
    data: T;
  }
  
  export function withLogs<T>(promise: Promise<ResponseProps<T>>, fnName: string): Promise<T> {
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
  