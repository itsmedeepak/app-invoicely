import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { RouterConfig } from './routes.tsx'
import { Provider } from 'react-redux';
import { store } from "./store/store.ts"

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={RouterConfig} />
    </Provider>
  </React.StrictMode>
);