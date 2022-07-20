import { ContentWrapper, Flex, Text, TextSizes, theme } from '@screencloud/alfie-alpha';

type Props = {
  title?: string;
  message?: string;
};
export function NotificationSlide(props: Props) {
  return (
    <ContentWrapper backgroundColor={theme.colors.white}>
      <Flex height="100%" flexDirection="column" justifyContent="center" alignItems="center">
        {props.title && (
          <Text
            type={TextSizes.H2}
            textAlign="center"
            fontWeight="bold"
            style={{ marginBottom: 24 }}
          >
            {props.title}
          </Text>
        )}
        {props.message && (
          <Text type={TextSizes.H3} textAlign="center">
            {props.message}
          </Text>
        )}
      </Flex>
    </ContentWrapper>
  );
}
