import { Typography } from '@mui/material';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import { GraphQLClient } from 'graphql-request';
import { FormEvent, useCallback, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { AppConfig } from '../../../app-types';
import NumberField from '../../../components/ui/NumberField';
import SpinnerBox from '../../../components/ui/SpinnerBox';
import { getEndpoint } from '../../../service/contentful-api/contentful-graphql-service';
import { useLocalesQuery } from '../../../service/contentful-api/contentful-rest';
import {
  ContentFeedsGql,
  ContentFeedsGqlResponse,
} from '../../../service/schema-connector/content-mapping.queries';

type Props = {
  initialConfig?: AppConfig;
  onChange?: (config?: AppConfig) => any;
};

const SLIDE_DUR_RANGE = [3, 300];
const FETCH_INTERVAL_RANGE = [3, 3600];

// const Logo = styled('img')({
//   maxWidth: 200,
// });

const FormContainer = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(4),
  position: 'relative',
  'input::-webkit-outer-spin-button, input::-webkit-inner-spin-button': {
    WebkitAppearance: 'none',
    margin: 0,
  },
  'input[type=number]': {
    MozAppearance: 'textfield',
  },
}));

export default function EditorForm(props: Props) {
  const { onChange } = props;
  const [config, setConfig] = useState<Partial<AppConfig>>({
    spaceId: '',
    apiKey: '',
    previewApiKey: '',
    contentFeed: '',
    appDefinitionName: '',
    slideDuration: 20000,
    fetchInterval: 60000,
    ...props.initialConfig,
  });

  const { spaceId, apiKey, previewApiKey, contentFeed, preview } = config;

  const gqlClient = useMemo(() => {
    const _apiKey = !!preview ? previewApiKey : apiKey;
    if (!spaceId || !_apiKey) return undefined;
    return new GraphQLClient(getEndpoint({ spaceId, apiKey: _apiKey }), {
      errorPolicy: 'all',
    });
  }, [apiKey, preview, previewApiKey, spaceId]);

  // const contentFeedsQuery = useFeedsAndPlaylistsQuery(spaceId, apiKey, preview, {
  //   retry: false,
  // });
  // /** Contentfeeds loaded from cf after env config is set. */
  // const contentFeeds = useMemo(() => {
  //   return [
  //     ...(contentFeedsQuery.data?.feeds?.map(f => ({
  //       name: f.name,
  //       id: `feed:${f.sys.id}`,
  //     })) || []),
  //     ...(contentFeedsQuery.data?.playlists?.map(p => ({
  //       name: p.title,
  //       id: `playlist:${p.sys.id}`,
  //     })) || []),
  //   ];
  // }, [contentFeedsQuery.data?.feeds, contentFeedsQuery.data?.playlists]);

  const contentFeedsQuery = useQuery(
    [`EditorForm.contentFeedsQuery`, spaceId, apiKey],
    () => gqlClient?.request<ContentFeedsGqlResponse>(ContentFeedsGql),
    {
      enabled: !!spaceId && !!apiKey,
      retry: false,
    }
  );

  const contentFeeds = useMemo(
    () =>
      contentFeedsQuery.data?.contentFeedCollection.items.map(item => ({
        name: item.name,
        id: item.sys.id,
      })) || [],
    [contentFeedsQuery.data?.contentFeedCollection.items]
  );
  // console.log('feedsAndPlaylistsQuery', feedsAndPlaylistsQuery);

  const localesQuery = useLocalesQuery(
    config.spaceId,
    config[config.preview ? 'previewApiKey' : 'apiKey'],
    config.preview
  );

  // const appDefinitionNeeded = selectedContentFeed && !selectedContentFeed.id.startsWith('feed');
  /** If a contentfeed is selected without a mappingConfig we get the appDefinitions for manual select. */
  // const appDefinitionsQuery = useAppDefinitionsQuery();
  // console.log('appDefinitionsQuery', appDefinitionsQuery.data);
  // const appDefinitions = useMemo(() => {
  //   if (!appDefinitionNeeded) return undefined;
  //   return appDefinitionsQuery.data?.map(d => ({ name: d.label || d.name, id: d.name }));
  // }, [appDefinitionNeeded, appDefinitionsQuery.data]);

  /** dispatch config changes */
  const emitConfig = useCallback(
    (config: Partial<AppConfig>) => {
      if (!config) return;
      const newConfig: Partial<AppConfig> = {
        ...config,
        contentFeed: config.contentFeed?.trim(),
        locale: config.locale?.trim(), // `default` locale is represented as ` ` in the form. By triming we set it to falsy.
      };
      if (onChange) {
        if (!newConfig.apiKey || !newConfig.contentFeed || !newConfig.spaceId) {
          onChange(undefined);
        } else {
          onChange(newConfig as any);
        }
      }
    },
    [onChange]
  );

  const onEnvChange = (ev: FormEvent) => {
    const target = ev.target as HTMLInputElement;
    // console.log('onEnvChange', target.name, target.checked);
    const newState = {
      ...config,
      [target.name]: target.type === 'checkbox' ? !!target.checked : target.value || undefined,
    };
    setConfig(newState);
    emitConfig(newState);
  };

  const contentConfigEnabled = !!contentFeeds.length;

  return (
    <>
      {/* <Box>
        <Logo src={logo} alt="Logo" />
      </Box> */}
      <form noValidate autoComplete="off">
        <FormContainer container gap={0} rowGap={2} alignItems="center">
          <Grid item xs={12}>
            <Typography variant="h6">Content source</Typography>
          </Grid>

          <Grid item xs={6}>
            <FormLabel htmlFor="spaceId" required>
              Space ID
            </FormLabel>
          </Grid>
          <Grid item xs={6}>
            <TextField
              id="spaceId"
              name="spaceId"
              value={spaceId || ''}
              fullWidth
              onChange={onEnvChange}
            />
          </Grid>

          <Grid item xs={6}>
            <FormLabel htmlFor="apiKey" required>
              Delivery API key (CDA)
            </FormLabel>
          </Grid>
          <Grid item xs={6}>
            <TextField
              id="apiKey"
              name="apiKey"
              value={apiKey || ''}
              fullWidth
              onChange={onEnvChange}
            />
          </Grid>

          <Grid item xs={6}>
            <FormLabel htmlFor="previewApiKey">Preview API key (CPA)</FormLabel>
          </Grid>
          <Grid item xs={6}>
            <TextField
              id="previewApiKey"
              name="previewApiKey"
              value={previewApiKey || ''}
              fullWidth
              onChange={onEnvChange}
            />
          </Grid>

          <Grid item xs={6}>
            <FormLabel htmlFor="contentFeed" required>
              Content feed
            </FormLabel>
          </Grid>
          <Grid item xs={6}>
            <TextField
              select
              id="contentFeed"
              name="contentFeed"
              fullWidth
              value={contentFeed || ' '}
              disabled={!contentConfigEnabled}
              onChange={ev => !!ev.target.value && onEnvChange(ev)}
            >
              <MenuItem value=" " disabled>
                <em>Select contentfeed</em>
              </MenuItem>
              {!!contentFeeds.length ? (
                contentFeeds.map(feed => (
                  <MenuItem key={feed.id} value={feed.id}>
                    {feed.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="" />
              )}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6">Presentation settings</Typography>
          </Grid>

          <Grid item xs={6}>
            <FormLabel htmlFor="preview" disabled={!previewApiKey}>
              Preview mode
            </FormLabel>
          </Grid>
          <Grid item xs={6} textAlign="right">
            <Switch
              id="preview"
              name="preview"
              color="primary"
              disabled={!previewApiKey}
              value={!!previewApiKey && preview}
              onChange={onEnvChange}
            />
          </Grid>

          <Grid item xs={6}>
            <FormLabel htmlFor="locale">Locale</FormLabel>
          </Grid>
          <Grid item xs={6}>
            <TextField
              select
              id="locale"
              name="locale"
              fullWidth
              value={config.locale || ' '}
              disabled={!contentConfigEnabled || !localesQuery.data?.length}
              onChange={onEnvChange}
            >
              {!!localesQuery.data ? (
                [
                  <MenuItem key="default" value=" ">
                    Default
                  </MenuItem>,
                  localesQuery.data.map(locale => (
                    <MenuItem key={locale.code} value={locale.code}>
                      {locale.name}
                    </MenuItem>
                  )),
                ]
              ) : (
                <MenuItem value=" ">Default</MenuItem>
              )}
            </TextField>
          </Grid>

          <Grid item xs={6}>
            <FormLabel htmlFor="slideDuration" required>
              Slide duration (in seconds)
            </FormLabel>
          </Grid>
          <Grid item xs={6}>
            <NumberField
              id="slideDuration"
              name="slideDuration"
              defaultValue={(config.slideDuration || 20000) / 1000}
              min={SLIDE_DUR_RANGE[0]}
              max={SLIDE_DUR_RANGE[1]}
              disabled={!contentConfigEnabled}
              onBlur={value => {
                const newState = { ...config, slideDuration: value * 1000 };
                setConfig(newState);
                emitConfig(newState);
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <FormLabel htmlFor="fetchInterval" required>
              Polling frequency (in seconds)
            </FormLabel>
          </Grid>
          <Grid item xs={6}>
            <NumberField
              id="fetchInterval"
              name="fetchInterval"
              defaultValue={(config.fetchInterval || 60000) / 1000}
              min={FETCH_INTERVAL_RANGE[0]}
              max={FETCH_INTERVAL_RANGE[1]}
              disabled={!contentConfigEnabled}
              onBlur={value => {
                const newState = { ...config, fetchInterval: value * 1000 };
                setConfig(newState);
                emitConfig(newState);
              }}
            />
          </Grid>
          {contentFeedsQuery.isLoading && <SpinnerBox />}
        </FormContainer>
      </form>
    </>
  );
}
