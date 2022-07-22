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
import { LabeledGridItem } from '../../../components/ui/LabeledGridItem';
import NumberField from '../../../components/ui/NumberField';
import SpinnerBox from '../../../components/ui/SpinnerBox';
import { getEndpoint } from '../../../service/contentful-api/contentful-graphql-service';
import { useLocalesQuery } from '../../../service/contentful-api/contentful-rest';
import {
  ContentFeedsGql,
  ContentFeedsGqlResponse,
} from '../../../service/schema-connector/content-mapping.queries';
import InfoIcon from '@mui/icons-material/InfoOutlined';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';

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

type Props = {
  initialConfig?: AppConfig;
  onChange?: (config?: AppConfig) => any;
  onError?: (error?: { title?: string; message: string }) => any;
};
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

  const contentFeedsQuery = useQuery(
    [`EditorForm.contentFeedsQuery`, spaceId, apiKey],
    () => gqlClient?.request<ContentFeedsGqlResponse>(ContentFeedsGql),
    {
      enabled: !!spaceId && !!apiKey,
      retry: false,
      onError: (error: any) => {
        if ((error as any).response?.status === 400) {
          const errorMsg = {
            title: 'Missing content',
            message:
              'Failed to detect a valid content feed and/or entries. Make sure the source space has a "Content feed" content type installed and there are valid entries published',
          };
          console.warn(errorMsg);
          props.onError?.(errorMsg);
        }
      },
      onSuccess: () => props.onError?.(),
    }
  );
  // console.log('contentFeedsQuery', contentFeedsQuery);

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
      <form noValidate autoComplete="off">
        <FormContainer container gap={0} rowGap={1} alignItems="center">
          <Grid item xs={12}>
            <Typography variant="h6">Content source</Typography>
          </Grid>

          <LabeledGridItem id="spaceId" label="Space ID" required>
            <TextField
              id="spaceId"
              name="spaceId"
              value={spaceId || ''}
              fullWidth
              onChange={onEnvChange}
            />
          </LabeledGridItem>

          <LabeledGridItem id="apiKey" label="Delivery API key (CDA)" required>
            <TextField
              id="apiKey"
              name="apiKey"
              type="password"
              value={apiKey || ''}
              fullWidth
              onChange={onEnvChange}
            />
          </LabeledGridItem>

          <LabeledGridItem id="previewApiKey" label="Preview API key (CPA)" required>
            <TextField
              id="previewApiKey"
              name="previewApiKey"
              type="password"
              value={previewApiKey || ''}
              fullWidth
              onChange={onEnvChange}
            />
          </LabeledGridItem>

          <LabeledGridItem id="contentFeed" label="Content feed" required>
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
          </LabeledGridItem>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6">Presentation settings</Typography>
          </Grid>

          <Grid item xs={6}>
            <Box display="flex" alignItems="center">
              <FormLabel htmlFor="preview" disabled={!previewApiKey}>
                Preview mode
              </FormLabel>
              <Tooltip
                placement="top"
                arrow
                title="When the Preview mode is activated, the app will display draft entries and unpublished changes alongside the published content. This may increase the risk of errors, especially when draft entries are missing required values."
              >
                <InfoIcon sx={{ ml: `5px`, mt: `3px` }} color="disabled" fontSize="small" />
              </Tooltip>
            </Box>
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

          <LabeledGridItem id="locale" label="Locale">
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
          </LabeledGridItem>

          <LabeledGridItem id="slideDuration" label="Slide duration (in seconds)" required>
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
          </LabeledGridItem>

          <LabeledGridItem
            id="fetchInterval"
            label="Polling frequency (in seconds)"
            tooltip="The polling frequency setting determines how often the content is refreshed. Minimum setting is 3 seconds, maximum 3,600 seconds or 1 hour."
            required
          >
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
          </LabeledGridItem>

          {contentFeedsQuery.isLoading && <SpinnerBox />}
        </FormContainer>
      </form>
    </>
  );
}
