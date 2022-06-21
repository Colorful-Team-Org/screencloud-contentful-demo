import { Box, Checkbox, Divider, FormControlLabel, MenuItem, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { FormEvent, useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import SpinnerBox from '../../../components/SpinnerBox';
import { useScreenCloudEditor } from '../../../providers/ScreenCloudEditorProvider';
import { gqlRequest } from '../../../service/contentful-api/contentful-graphql-service';
import logo from '../assets/contentful-logo.png';

type Props = {
  config?: ContentFeedConfig;
  onChange?: (config?: ContentFeedConfig) => any;
};

type EnvConfig = { spaceId: string; apiKey: string; preview?: boolean };

export type ContentFeedConfig = EnvConfig & {
  contentFeed: string;
};

const Logo = styled('img')({
  width: `100%`,
});

const ContentConfig = styled('div')({
  position: 'relative',
});

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
  const feedsQuery = useQuery(
    ['contentfeeds', spaceId, apiKey],
    () =>
      gqlRequest<any>(spaceId!, apiKey!, `{ contentFeedCollection { items { name sys { id } } } }`),
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

  /** populate screencloud config function */
  useEffect(() => {
    if (!config) return;
    console.log(`adding config to sc`, config);
    sc.onRequestConfigUpdate?.(() => Promise.resolve({ config }));
  }, [config, sc]);

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
