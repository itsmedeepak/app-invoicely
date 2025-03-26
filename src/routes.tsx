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

// Demo components


export const DashboardPage = () => (
    <div>
        <h1>Dashboard</h1>
        <p>Overview of your invoices, customers, and sales.</p>
    </div>
);







export const Sales = () => (
    <div>
        <h1>Sales Report</h1>
        <p>Sales data and analytics go here.</p>
    </div>
);

export const Traffic = () => (
    <div>
        <h1>Traffic Report</h1>
        <p>Website traffic statistics displayed here.</p>
    </div>
);

export const Integrations = () => (
    <div>
        <h1>Integrations</h1>
        <p>Manage your app integrations here. (Coming Soon)</p>
    </div>
);

export const NotFound = () => (
    <div>
        <h1>404 - Not Found</h1>
        <p>The page you're looking for doesn't exist.</p>
    </div>
);

// Create router config
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
          Component: NotFound,
        },
      ],
    },
  ]);
  
