import { memo } from 'react';
import { ErrorScreen } from '../components/ErrorScreen';
import { SlideShow } from '../components/SlideShow/SlideShow';
import { useContentFeedItems } from '../providers/ContentFeedProvider';
import './AppContainer.css';

interface Props {}

const SlideShowMemo = memo(SlideShow);

function App(props: Props) {
  const { error, data } = useContentFeedItems();

  return !!error ? <ErrorScreen /> : <SlideShowMemo data={data} />;
}

export default App;
