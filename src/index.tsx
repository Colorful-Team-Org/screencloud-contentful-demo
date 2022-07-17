import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

/* 
LAYOUTS
 - hero
 - products
 - quotes
 - blog
*/

console.log(`version 1.1.0`);

const Index = lazy(() => import('./pages/app-page'));
const Editor = lazy(() => import('./pages/editor-page'));

ReactDOM.render(
  <React.StrictMode>
    <Suspense fallback={<div>Loading...</div>}>
      <BrowserRouter>
        <Routes>
          <Route index element={<Index />} />
          <Route path="/editor" element={<Editor />} />
        </Routes>
      </BrowserRouter>
    </Suspense>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
if (typeof window !== 'undefined') {
  console.log(`pathname`, window.location.pathname);
  if (window.location.pathname.startsWith(`/editor`)) {
    serviceWorkerRegistration.unregister();
  } else {
    serviceWorkerRegistration.register();
  }
}
