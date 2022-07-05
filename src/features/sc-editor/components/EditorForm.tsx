import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { AppConfig } from '../../../app-types';
import NumberField from '../../../components/NumberField';
import SpinnerBox from '../../../components/SpinnerBox';
import { gqlRequest } from '../../../service/contentful-api/contentful-graphql-service';
import { useLocales } from '../../../service/contentful-api/contentful-rest';
import { useScreenCloudEditor } from '../ScreenCloudEditorProvider';

type Props = {
  config?: AppConfig;
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
  const sc = useScreenCloudEditor();
  const [config, setConfig] = useState<Partial<AppConfig>>({
    spaceId: '',
    apiKey: '',
    previewApiKey: '',
    contentFeed: '',
    slideDuration: 20000,
    fetchInterval: 60000,
    ...sc.config,
  });

  const { spaceId, apiKey, previewApiKey, contentFeed, preview } = config;

  /** Contentfeeds loaded from cf after env config is set. */
  const feedsQuery = useQuery(
    ['contentfeeds', spaceId, apiKey, preview],
    () =>
      gqlRequest<any>(
        spaceId!,
        apiKey!,
        `{ contentFeedCollection(preview: ${String(!!preview)}) { items { name sys { id } } } }`
      ),
    { enabled: !!spaceId && !!apiKey, retry: false }
  );

  const contentFeeds: { id: string; name: string }[] = useMemo(() => {
    if (feedsQuery.isError) {
      return [];
    }
    return (
      feedsQuery.data?.contentFeedCollection.items.map((item: any) => ({
        name: item.name,
        id: item.sys.id,
      })) || []
    );
  }, [feedsQuery.data, feedsQuery.isError]);

  const localesQuery = useLocales(config.spaceId, config.apiKey, config.preview);

  const onEnvChange = (ev: FormEvent) => {
    const target = ev.target as HTMLInputElement;
    console.log('onEnvChange', target.name, target.checked);
    const newState = {
      ...config,
      [target.name]: target.type === 'checkbox' ? !!target.checked : target.value || undefined,
    };
    setConfig(newState);
    sc.emitConfigUpdateAvailable?.();
  };

  // useEffect(() => {
  //   if (config.spaceId && config.apiKey && config.contentFeed) {
  //     props.onChange?.(config as any);
  //   }
  // }, [config, props]);

  /** dispatch config changes */
  useEffect(() => {
    if (!config) return;
    if (props.onChange) {
      if (!config.apiKey || !config.contentFeed || !config.spaceId) {
        props.onChange(undefined);
      } else {
        props.onChange(config as any);
      }
    }
    sc.emitConfigUpdateAvailable?.();

    sc.onRequestConfigUpdate?.(() => Promise.resolve({ config }));
  }, [config, props, sc]);

  const contentConfigEnabled = !!contentFeeds.length;

  return (
    <>
      {/* <Box>
        <Logo src={logo} alt="Logo" />
      </Box> */}
      <form noValidate autoComplete="off">
        <FormContainer container gap={0} rowGap={2} alignItems="center">
          <Grid item xs={6}>
            <FormLabel htmlFor="spaceId">Space ID</FormLabel>
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
            <FormLabel htmlFor="apiKey">API Key</FormLabel>
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
            <FormLabel htmlFor="apiKey">Preview API Key</FormLabel>
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
            <FormLabel htmlFor="preview" disabled={!previewApiKey}>
              Preview
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

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
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
              value={config.locale || ''}
              disabled={!contentConfigEnabled || !localesQuery.data?.length}
              onChange={onEnvChange}
              // onChange={onContentFeedChange}
            >
              {!!localesQuery.data ? (
                [
                  <MenuItem key="default" value="">
                    Default
                  </MenuItem>,
                  localesQuery.data.map(locale => (
                    <MenuItem key={locale.code} value={locale.code}>
                      {locale.name}
                    </MenuItem>
                  )),
                ]
              ) : (
                <MenuItem value="" />
              )}
            </TextField>
          </Grid>

          <Grid item xs={6}>
            <FormLabel htmlFor="contentFeed">Content feed</FormLabel>
          </Grid>
          <Grid item xs={6}>
            <TextField
              select
              id="contentFeed"
              name="contentFeed"
              fullWidth
              value={contentFeed || ''}
              disabled={!contentConfigEnabled}
              onChange={ev => !!ev.target.value && onEnvChange(ev)}
            >
              <MenuItem value="" disabled>
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

          <Grid item xs={6}>
            <FormLabel htmlFor="slideDuration">Slide duration sec.</FormLabel>
          </Grid>
          <Grid item xs={6}>
            <NumberField
              id="slideDuration"
              name="slideDuration"
              defaultValue={(config.slideDuration || 20000) / 1000}
              min={SLIDE_DUR_RANGE[0]}
              max={SLIDE_DUR_RANGE[1]}
              disabled={!contentConfigEnabled}
              onBlur={value =>
                setConfig(state => ({
                  ...state,
                  slideDuration: value * 1000,
                }))
              }
            />
          </Grid>
          <Grid item xs={6}>
            <FormLabel htmlFor="fetchInterval">Refetch interval sec.</FormLabel>
          </Grid>
          <Grid item xs={6}>
            <NumberField
              id="fetchInterval"
              name="fetchInterval"
              defaultValue={(config.fetchInterval || 60000) / 1000}
              min={FETCH_INTERVAL_RANGE[0]}
              max={FETCH_INTERVAL_RANGE[1]}
              disabled={!contentConfigEnabled}
              onBlur={value =>
                setConfig(state => ({
                  ...state,
                  fetchInterval: value * 1000,
                }))
              }
            />
          </Grid>
          {feedsQuery.isLoading && <SpinnerBox />}
        </FormContainer>
      </form>
    </>
  );
}
