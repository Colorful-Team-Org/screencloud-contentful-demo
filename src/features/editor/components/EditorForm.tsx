import { Box, Checkbox, Divider, FormControlLabel, MenuItem, TextField } from '@mui/material';
import debounce from 'lodash/debounce';
import React, { FormEvent, useCallback, useEffect, useState } from 'react';
import { useScreenCloudEditor } from '../../../providers/ScreenCloudEditorProvider';
import { gqlRequest } from '../../../service/contentful-api/contentful-graphql-service';

type Props = {
  config?: ContentFeedConfig;
  onChange?: (config?: ContentFeedConfig) => any;
};

type EnvConfig = { spaceId: string; apiKey: string; preview?: boolean };

export type ContentFeedConfig = EnvConfig & {
  contentFeed: string;
};

export default function EditorForm(props: Props) {
  const sc = useScreenCloudEditor();
  useEffect(() => {
    if (sc.config?.spaceId && sc.config.apiKey && sc.config.contentFeed) {
      props.onChange?.(sc.config);
    }
  }, [sc, props]);

  const [config, setConfig] = useState<Partial<ContentFeedConfig>>({
    spaceId: sc.config?.spaceId,
    apiKey: sc.config?.apiKey,
    contentFeed: sc.config?.contentFeed,
  });

  const { spaceId, apiKey, contentFeed } = config;
  /** Contentfeeds loaded from cf after env config is set. */
  const [contentFeeds, setContentFeeds] = useState<{ name: string; id: string }[]>([]);
  /** Complete config for a Screencloud app setuo */

  const fetchContentFeeds = useCallback(async (spaceId: string, apiKey: string) => {
    if (spaceId.length < 5 || apiKey.length < 20) return;
    try {
      const response = await gqlRequest<any>(
        spaceId,
        apiKey,
        `{ contentFeedCollection { items { name sys { id } } } }`
      );
      setContentFeeds(
        response.contentFeedCollection.items.map((item: any) => ({
          name: item.name,
          id: item.sys.id,
        }))
      );
    } catch (err) {
      console.warn('error during gql request', err);
      setConfig(state => ({ ...state, contentFeed: undefined }));
      setContentFeeds([]);
    }
  }, []);

  const onEnvChange = (ev: FormEvent) => {
    const target = ev.target as HTMLInputElement;
    // console.log('name', target.name, target.value);
    setConfig(state => ({
      ...state,
      [target.name]: target.type === 'checkbox' ? !!target.checked : target.value,
    }));
  };

  const onContentFeedChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const newConfig = { ...config, contentFeed: ev.target.value };
    setConfig(newConfig);

    if (props.onChange) {
      if (!newConfig.apiKey || !newConfig.contentFeed || !newConfig.spaceId) {
        props.onChange(undefined);
      } else {
        props.onChange(newConfig as any);
      }
    }
    sc.emitConfigUpdateAvailable?.();
  };

  /** fetch contentFeeds on env config change */
  useEffect(() => {
    if (!spaceId || !apiKey) return;
    const debounced = debounce(() => {
      if (!spaceId || !apiKey) return;
      fetchContentFeeds(spaceId, apiKey);
    }, 2000);
    debounced();
    return () => debounced.cancel();
  }, [apiKey, spaceId, fetchContentFeeds]);

  /** populate screencloud config function */
  useEffect(() => {
    if (!config) return;
    console.log(`adding config to sc`, config);
    sc.onRequestConfigUpdate?.(() => Promise.resolve({ config }));
  }, [config, sc]);

  return (
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
      {!!contentFeeds.length ? (
        <TextField
          select
          placeholder="Content feed"
          label="Content feed"
          fullWidth
          value={contentFeed || ''}
          onChange={onContentFeedChange}
        >
          <MenuItem value="">
            <em>Select contentfeed</em>
          </MenuItem>
          {contentFeeds.map(feed => (
            <MenuItem key={feed.id} value={feed.id}>
              {feed.name}
            </MenuItem>
          ))}
        </TextField>
      ) : (
        <TextField disabled placeholder="Content feed" fullWidth />
      )}
    </Box>
  );
}
