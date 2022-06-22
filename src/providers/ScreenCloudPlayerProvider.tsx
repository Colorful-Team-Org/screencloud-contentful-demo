import { connectScreenCloud } from '@screencloud/apps-sdk';
import { Theme } from '@screencloud/apps-sdk/lib/types';
import React, { PropsWithChildren, useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AppConfig } from '../app-types';
import { config as devConfig } from '../config.development';
import { configFromUrlParams } from '../service/url-params';
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
      let appConfig: AppConfig | undefined = undefined;
      if (process.env.NODE_ENV === 'development') {
        appConfig = devConfig.config;
      }
      appConfig = configFromUrlParams(searchParams, appConfig);

      const sc = await connectScreenCloud<AppConfig>(appConfig ? { config: appConfig } : undefined);
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
