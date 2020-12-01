import { useEffect } from 'react';
import { Plugins } from '@capacitor/core';
import { getLogger } from '../../core/logger';
import { useNetwork } from '../communication/useNetwork';

const { App, BackgroundTask } = Plugins;
const log =  getLogger( "Backgound");
export const useBackgroundTask = (asyncTask: () => Promise<void>) => {
  const { networkStatus } = useNetwork();

  useEffect(() => {
    let taskId = BackgroundTask.beforeExit(async () => {
     log('useBackgroundTask - executeTask started');
      await asyncTask();
      log('useBackgroundTask - executeTask finished');
     
      BackgroundTask.finish({ taskId });
    });
  }, [networkStatus.connected])
  return {};
};
