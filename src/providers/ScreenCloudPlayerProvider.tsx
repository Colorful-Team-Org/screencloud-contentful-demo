import { connectScreenCloud } from '@screencloud/apps-sdk';
import { Theme } from '@screencloud/apps-sdk/lib/types';
import React, {
  PropsWithChildren, useContext, useEffect, useState
} from 'react';
import { useSearchParams } from 'react-router-dom';
import { AppConfig } from '../app-types';
import { config as devConfig } from '../config.development';
import { parseSearch } from '../utils/url-utils';

export interface ScreenCloudPlayer {
  appStarted: boolean;
  config?: AppConfig;
  theme?: Theme;
}

const initialState = { appStarted: false, config: undefined };

export const ScreenCloudPlayerContext = React.createContext<ScreenCloudPlayer>(initialState);

type ScreenCloudState = {
  config?: AppConfig;
  theme?: Theme;
  appStarted: boolean;
};
export function ScreenCloudPlayerProvider(props: PropsWithChildren<any>) {
  const [state, setState] = useState<ScreenCloudState>({ appStarted: false });
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const getConfig = async () => {
      let appConfig: AppConfig = { spaceId: '', apiKey: '', playlistId: '' };
      if (process.env.NODE_ENV === 'development') {
        appConfig = devConfig.config;
      }
      const params = parseSearch(searchParams);
      if (params['space-id']) appConfig.spaceId = params['space-id'];
      if (params['api-key']) appConfig.apiKey = params['api-key'];
      if (params['playlist']) appConfig.playlistId = params['playlist'];

      const sc = await connectScreenCloud<AppConfig>({ config: appConfig });
      setState(state => ({
        ...state,
        config: sc.getConfig(),
        theme: sc.getContext().theme,
      }));
      await sc.onAppStarted();
      setState(state => ({ ...state, appStarted: true }));
    };

    getConfig();
  }, [searchParams]);

  return (
    <ScreenCloudPlayerContext.Provider value={state}>
      {state.config && props.children}
    </ScreenCloudPlayerContext.Provider>
  );
}

export const useScreenCloudPlayer = (): ScreenCloudPlayer => useContext(ScreenCloudPlayerContext);
