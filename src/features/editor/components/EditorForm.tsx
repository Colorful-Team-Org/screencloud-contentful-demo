import { Box, Checkbox, Divider, FormControlLabel, MenuItem, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { AppConfig } from '../../../app-types';
import NumberField from '../../../components/NumberField';
import SpinnerBox from '../../../components/SpinnerBox';
import { useScreenCloudEditor } from '../../../providers/ScreenCloudEditorProvider';
import { gqlRequest } from '../../../service/contentful-api/contentful-graphql-service';
import { useLocales } from '../../../service/contentful-api/contentful-rest';
import logo from '../assets/contentful-logo.png';

type Props = {
  config?: AppConfig;
  onChange?: (config?: AppConfig) => any;
};

const SLIDE_DUR_RANGE = [3, 300];
const FETCH_INTERVAL_RANGE = [3, 3600];

const Logo = styled('img')({
  width: `100%`,
});

const ContentConfig = styled('div')({
  position: 'relative',
  'input::-webkit-outer-spin-button, input::-webkit-inner-spin-button': {
    WebkitAppearance: 'none',
    margin: 0,
  },
  'input[type=number]': {
    MozAppearance: 'textfield',
  },
});

export default function EditorForm(props: Props) {
  const sc = useScreenCloudEditor();
  const [config, setConfig] = useState<Partial<AppConfig>>({
    spaceId: '',
    apiKey: '',
    contentFeed: '',
    slideDuration: 20000,
    fetchInterval: 60000,
    ...sc.config,
  });

  const { spaceId, apiKey, contentFeed, preview } = config;

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
    console.log('onEnvChange', target.name, target.value);
    const newState = {
      ...config,
      [target.name]: target.type === 'checkbox' ? !!target.checked : target.value || undefined,
    };
    setConfig(newState);
    sc.emitConfigUpdateAvailable?.();
  };

  useEffect(() => {
    if (config.spaceId && config.apiKey && config.contentFeed) {
      props.onChange?.(config as any);
    }
  }, [config, props]);

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
      <Box>
        <Logo src={logo} alt="Logo" />
      </Box>
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { my: 1 },
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          value={spaceId || ''}
          name="spaceId"
          label="Space ID"
          fullWidth
          onChange={onEnvChange}
        />
        <TextField
          value={apiKey || ''}
          name="apiKey"
          label="API Key"
          fullWidth
          onChange={onEnvChange}
        />

        <FormControlLabel
          label="Preview"
          control={<Checkbox name="preview" onChange={onEnvChange} />}
        />

        <Divider sx={{ my: 2 }} />

        <ContentConfig>
          <TextField
            select
            name="locale"
            label="Locale"
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
          <TextField
            select
            name="contentFeed"
            label="Content feed"
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

          <NumberField
            label="Slide duration sec."
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
          <NumberField
            label="Refetch interval sec."
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
          {feedsQuery.isLoading && <SpinnerBox />}
        </ContentConfig>
      </Box>
    </>
  );
}
