import { Box, Checkbox, Divider, FormControlLabel, MenuItem, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { FormEvent, useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { AppConfig } from '../../../app-types';
import SpinnerBox from '../../../components/SpinnerBox';
import { useScreenCloudEditor } from '../../../providers/ScreenCloudEditorProvider';
import { gqlRequest } from '../../../service/contentful-api/contentful-graphql-service';
import logo from '../assets/contentful-logo.png';

type Props = {
  config?: AppConfig;
  onChange?: (config?: AppConfig) => any;
};

const Logo = styled('img')({
  width: `100%`,
});

const ContentConfig = styled('div')({
  position: 'relative',
});

export default function EditorForm(props: Props) {
  const sc = useScreenCloudEditor();

  const [config, setConfig] = useState<Partial<AppConfig>>({
    spaceId: sc.config?.spaceId,
    apiKey: sc.config?.apiKey,
    contentFeed: sc.config?.contentFeed,
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

  // useEffect(() => {
  //   if (contentFeed && !contentFeeds.find(c => c.id === contentFeed)) {
  //     setConfig(state => ({ ...state, contentFeed: undefined }));
  //   }
  // }, [contentFeed, contentFeeds]);

  const onEnvChange = (ev: FormEvent) => {
    const target = ev.target as HTMLInputElement;
    const newState = {
      ...config,
      [target.name]: target.type === 'checkbox' ? !!target.checked : target.value,
    };
    setConfig(newState);
    sc.emitConfigUpdateAvailable?.();
  };

  const onContentFeedChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const newConfig = { ...config, contentFeed: ev.target.value };
    setConfig(newConfig);
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
          {feedsQuery.isLoading && <SpinnerBox />}
        </ContentConfig>
      </Box>
    </>
  );
}
