import { QueryClient, QueryClientProvider } from 'react-query';
import { createWebStoragePersistor } from 'react-query/createWebStoragePersistor-experimental';
import { persistQueryClient } from 'react-query/persistQueryClient-experimental';
import App from '../containers/AppContainer/AppContainer';
import { ContentfulDataProvider } from '../providers/ContentfulDataProvider';
import {
  ScreenCloudPlayerContext,
  ScreenCloudPlayerProvider
} from '../providers/ScreenCloudPlayerProvider';
import { ContentfulApiContext } from '../service/contentful-api/contentful-api-ctx';
import styles from './app-page.module.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: Infinity,
    },
  },
});

persistQueryClient({
  queryClient,
  persistor: createWebStoragePersistor({ storage: window.localStorage }),
});

export default function AppPage() {
  return (
    <ScreenCloudPlayerProvider>
      <ScreenCloudPlayerContext.Consumer>
        {({ config }) => (
          <QueryClientProvider client={queryClient}>
            <ContentfulApiContext.Provider
              value={{ apiKey: config?.apiKey, spaceId: config?.spaceId }}
            >
              <ContentfulDataProvider contentFeedId={config?.contentFeed} refetchInterval={3000}>
                <div className={styles.appPage}>
                  <App />
                </div>
                <div style={{ position: 'fixed', bottom: 10, right: 10, color: '#aaa' }}>
                  v1.1.0
                </div>
              </ContentfulDataProvider>
            </ContentfulApiContext.Provider>
          </QueryClientProvider>
        )}
      </ScreenCloudPlayerContext.Consumer>
    </ScreenCloudPlayerProvider>
  );
}
