import { createBrowserRouter } from 'react-router-dom';
import App from './App'; // Toolpad AppProvider wrapper
import Layout from './components/layout/layout'; // Dashboard layout
import SignIn from './components/auth/sign-in';
import SignUp from './components/auth/sign-up';
import { Customers } from './components/dashboard/customers';
import { Products } from './components/dashboard/products';

import UserProfile from './components/auth/profile/user-profile';
import Subscription from './components/auth/profile/subscription';
import Billing from './components/auth/profile/billing';
import CreateInvoice from './components/dashboard/invoice/create-invoice';
import { Invoices } from './components/dashboard/invoice';
import Dashboard from './components/dashboard';
import SalesAndInvoicesReport from './components/report';
import Configuration from './components/configuration';
import HelpSection from './components/help';
import NotFoundPage from './components/404';
import ComingSoonPage from './components/comming-soon';

export const RouterConfig = createBrowserRouter([
    {
      path: '/',
      Component: App, // Root Toolpad provider
      children: [
        {
          path: '',
          Component: Layout, // Dashboard layout wraps the dashboard
          children: [
            { index: true, Component: Dashboard }, // ✅ Dashboard at root "/"
            { path: 'invoices', Component: Invoices },
            { path: 'create-invoice', Component: CreateInvoice },
            { path: 'customers', Component: Customers },
            { path: 'products', Component: Products },
            { path: 'reports', Component: SalesAndInvoicesReport },
            { path: 'configuration', Component: Configuration },
            { path: 'profile', Component: UserProfile },
            { path: 'subscriptions', Component: Subscription },
            { path: 'billing', Component: Billing },
            { path: 'help-center', Component: HelpSection },
            { path: 'integrations', Component: ComingSoonPage},
            
          ],
        },
        {
          path: 'auth/sign-up',
          Component: SignUp,
        },
        {
          path: 'auth/sign-in',
          Component: SignIn,
        },
        {
          path: '*',
          Component: NotFoundPage,
        },
      ],
    },
  ]);
  
