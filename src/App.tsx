// src/App.tsx
import * as React from 'react';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { ReactRouterAppProvider } from '@toolpad/core/react-router';
import { Outlet } from 'react-router';
import Navigation from './components/layout/navigation';
import { Session } from './utils/types';
import { ToastContainer } from 'react-toastify';

const session: Session | null = {
  user: {
    name: 'Bharat Kashyap',
    email: 'bharatkashyap@outlook.com',
    image: 'https://avatars.githubusercontent.com/u/19550456',
  },
};

export default function App() {
  return (
    <ReactRouterAppProvider
      navigation={Navigation}
      session={session}
      branding={{
        logo: <ReceiptIcon fontSize="large" color="primary" />,
        title: 'Invoicely',
        homeUrl: '/dashboard',
      }}
    >
        <ToastContainer position="bottom-center" autoClose={3000} />

      <Outlet />
    
    </ReactRouterAppProvider>
  );
}
