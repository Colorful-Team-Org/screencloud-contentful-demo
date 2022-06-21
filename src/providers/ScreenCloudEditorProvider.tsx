import { connectScreenCloud } from '@screencloud/apps-editor-sdk';
import {
  EmitConfigUpdateAvailable,
  OnRequestConfigUpdate,
} from '@screencloud/apps-editor-sdk/lib/types';
import React, { PropsWithChildren, useContext, useEffect, useState } from 'react';
import { AppConfig } from '../app-types';
import { config as devConfig } from '../config.development';

export const ScreenCloudEditorContext = React.createContext<ScreenCloudState>({});

type ScreenCloudState = {
  config?: AppConfig;
  onRequestConfigUpdate?: OnRequestConfigUpdate;
  emitConfigUpdateAvailable?: EmitConfigUpdateAvailable;
};
export function ScreenCloudEditorProvider(props: PropsWithChildren<any>) {
  const [state, setState] = useState<ScreenCloudState>({});

  useEffect(() => {
    const getConfig = async () => {
      let appConfig: AppConfig = { spaceId: '', apiKey: '', playlistId: '' };
      if (process.env.NODE_ENV === 'development') {
        appConfig = devConfig.config;
      }

      const sc = await connectScreenCloud<AppConfig>({ config: appConfig });
      setState(state => ({
        onRequestConfigUpdate: sc.onRequestConfigUpdate,
        emitConfigUpdateAvailable: sc.emitConfigUpdateAvailable,
        config: sc.getConfig(),
      }));
    };

    getConfig();
  }, []);

  return (
    <ScreenCloudEditorContext.Provider value={state}>
      {state.config && props.children}
    </ScreenCloudEditorContext.Provider>
  );
}

export const useScreenCloudEditor = (): ScreenCloudState => useContext(ScreenCloudEditorContext);
