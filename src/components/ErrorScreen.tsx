import { Text, TextSizes, theme } from '@screencloud/alfie-alpha';

export const ErrorScreen = () => {
  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: theme.colors.white,
        padding: 50,
      }}
    >
      <img src="/img/Error_accident_ice_cream_fell.png" alt="" style={{ maxWidth: 300 }} />
      <Text
        type={TextSizes.H4}
        color={theme.colors.mainText}
        fontFamily={'sans-serif'}
        fontWeight={theme.fontWeights.black}
        wordBreak="break-word"
        paddingTop={{ _: 4 }}
      >
        Something went wrong.
      </Text>
      <Text
        type={TextSizes.P}
        color={theme.colors.defaultErrorBackground}
        fontFamily={'sans-serif'}
        fontWeight={theme.fontWeights.black}
        wordBreak="break-word"
        paddingTop={{ _: 4 }}
        textAlign="center"
        width="100%"
      >
        Your content cannot be loaded.
        <br />
        Check your internet connection and/or app configuration.
      </Text>
    </div>
  );
};
