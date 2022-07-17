import { QueryClient, QueryClientProvider } from 'react-query';
import App from '../components/AppContainer';
import { NotificationSlide } from '../components/SlideShow/NotificationSlide';
import {
  ScreenCloudPlayerContext,
  ScreenCloudPlayerProvider,
} from '../features/sc-player/ScreenCloudPlayerProvider';
import { ContentFeedItemsProvider } from '../providers/ContentFeedProvider';
import { ContentfulApiConfigCtx } from '../service/contentful-api/contentful-api-ctx';
import { GraphQLClientProvider } from '../service/contentful-api/contentful-graphql-service';
import { ContentfulRestClientProvider } from '../service/contentful-api/contentful-rest-client-ctx';
import styles from './app-page.module.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: Infinity,
    },
  },
});

// persistQueryClient({
//   queryClient,
//   persistor: createWebStoragePersistor({ storage: window.localStorage }),
// });

export default function AppPage() {
  return (
    <ScreenCloudPlayerProvider>
      <ScreenCloudPlayerContext.Consumer>
        {({ config }) => (
          <QueryClientProvider client={queryClient}>
            <ContentfulApiConfigCtx.Provider
              value={{
                // apiKey: config?.apiKey,
                apiKey: '',
                previewApiKey: config?.previewApiKey,
                spaceId: config?.spaceId,
                locale: config?.locale,
                preview: config?.preview,
              }}
            >
              <GraphQLClientProvider missingConfigFallback={<></>}>
                <ContentfulRestClientProvider>
                  <ContentFeedItemsProvider
                    contentFeedId={config?.contentFeed}
                    appDefinitionName={config?.appDefinitionName}
                    refetchInterval={config?.fetchInterval || 10000}
                  >
                    <div className={styles.appPage}>
                      <App />
                    </div>
                    {/* <div style={{ position: 'fixed', bottom: 10, right: 10, color: '#aaa' }}>
                      v1.2.0
                    </div> */}
                  </ContentFeedItemsProvider>
                </ContentfulRestClientProvider>
              </GraphQLClientProvider>
            </ContentfulApiConfigCtx.Provider>
          </QueryClientProvider>
        )}
      </ScreenCloudPlayerContext.Consumer>
    </ScreenCloudPlayerProvider>
  );
}
