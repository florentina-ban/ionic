import { Plugins } from '@capacitor/core';
import { getLogger } from '../../core/logger';

const { Storage } = Plugins;
const log = getLogger("localStorageApi");

export async function set (key: string, myValue: any) {
 
        // Saving ({ key: string, value: string }) => Promise<void>
        log("storing: ",key, myValue);
        return await Storage.set({
            key: key,
            value: JSON.stringify({
              myValue
            })
          });
    }
      
    // Loading value by key ({ key: string }) => Promise<{ value: string | null }>
    export async function get (key: string) {
        return await Storage.get({ key: key });      
    }

     
    //   // Loading keys () => Promise<{ keys: string[] }>
    //   const { keys } = await Storage.keys();
    //   console.log('Keys found', keys);

    //   // Removing value by key, ({ key: string }) => Promise<void>
    //   await Storage.remove({ key: 'token' });
    //   console.log('Keys found after remove', await Storage.keys());

      // Clear storage () => Promise<void>
     
     export async function clear() {
         return await Storage.clear();
    };
  