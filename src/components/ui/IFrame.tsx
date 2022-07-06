import { PropsWithChildren, useState } from 'react';
import { createPortal } from 'react-dom';

export default function IFrame({ children }: PropsWithChildren<any>) {
  const [ref, setRef] = useState<HTMLIFrameElement | null>();
  const container = ref?.contentDocument?.body;

  return (
    <iframe title="iframe" ref={setRef} width="1280">
      {container && createPortal(children, container)}
    </iframe>
  );
}
