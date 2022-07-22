import { maxWidth } from '@mui/system';
import { Flex } from '@screencloud/alfie-alpha';
import icon from './assets/img-placeholder-icon.png';

export function ImagePlaceholder() {
  return (
    // <Flex style={{ width: '100%', height: '100%', background: '#EAEAEB' }}>
    <Flex
      width="100%"
      height="100%"
      backgroundColor="#EAEAEB"
      justifyContent="center"
      alignItems="center"
    >
      <img src={icon} style={{ maxWidth: `50%`, width: 380 }} alt="placeholder" />
    </Flex>
  );
}
