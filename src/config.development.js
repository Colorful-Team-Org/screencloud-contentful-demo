export const config = {
  config: {
    apiKey: process.env.REACT_APP_API_KEY || '',
    previewApiKey: process.env.REACT_APP_PREVIEW_API_KEY || '',
    contentFeed: process.env.REACT_APP_PLAYLIST_ID || '',
    spaceId: process.env.REACT_APP_SPACE_ID || '',
  },
};
