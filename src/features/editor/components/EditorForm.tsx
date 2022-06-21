import { Box, Checkbox, Divider, FormControlLabel, MenuItem, TextField } from '@mui/material';
import debounce from 'lodash/debounce';
import React, { FormEvent, useCallback, useEffect, useState } from 'react';
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
  /** Config of the contentful space to be used. */
  const [envConfig, setEnvConig] = useState<Partial<EnvConfig>>();
  /** Contentfeeds loaded from cf ater env config is set. */
  const [contentFeeds, setContentFeeds] = useState<{ name: string; id: string }[]>([]);
  /** Complete config for a Screencloud app setuo */
  const [config, setConfig] = useState<Partial<ContentFeedConfig>>();

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
      setConfig({});
      setContentFeeds([]);
    }
  }, []);

  const onEnvChange = (ev: FormEvent) => {
    const target = ev.target as HTMLInputElement;
    // console.log('name', target.name, target.value);
    setConfig({});
    setEnvConig(state => ({
      ...state,
      [target.name]: target.type === 'checkbox' ? !!target.checked : target.value,
    }));
  };

  const onContentFeedChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const newConfig = { ...envConfig, contentFeed: ev.target.value };
    setConfig(newConfig);

    if (props.onChange) {
      if (!newConfig.apiKey || !newConfig.contentFeed || !newConfig.spaceId) {
        props.onChange(undefined);
      } else {
        props.onChange(newConfig as any);
      }
    }
  };

  useEffect(() => {
    if (!envConfig) return;
    const debounced = debounce(() => {
      if (!envConfig.spaceId || !envConfig.apiKey) return;
      fetchContentFeeds(envConfig.spaceId, envConfig.apiKey);
    }, 2000);
    debounced();
    return () => debounced.cancel();
  }, [envConfig, fetchContentFeeds]);

  return (
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { my: 1 },
      }}
      noValidate
      autoComplete="off"
    >
      <TextField onChange={onEnvChange} name="spaceId" label="Space ID" fullWidth />
      <TextField onChange={onEnvChange} name="apiKey" label="API Key" fullWidth />
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
          value={config?.contentFeed || ''}
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
