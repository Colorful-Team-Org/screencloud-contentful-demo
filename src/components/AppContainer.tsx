import { memo } from 'react';
import { ErrorScreen } from '../components/ErrorScreen';
import { SlideShow } from '../components/SlideShow/SlideShow';
import { useContentFeedItems } from '../providers/ContentFeedProvider';
import './AppContainer.css';
import { NotificationSlide } from './SlideShow/NotificationSlide';

interface Props {}

const SlideShowMemo = memo(SlideShow);

function App(props: Props) {
  const { error, data } = useContentFeedItems();

  if (!!error) {
    return <ErrorScreen />;
  }
  if (data?.items.length === 0) {
    return (
      <NotificationSlide
        title="No entries found."
        message="If you have entries attached to the feed, make sure the entries are published and match the type of the feed selected."
      />
    );
  }

  return <SlideShowMemo data={data} />;
}

export default App;
