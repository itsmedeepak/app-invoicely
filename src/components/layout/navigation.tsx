import { Navigation } from "@toolpad/core";

import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People'; // For Customers
import ReceiptIcon from '@mui/icons-material/Receipt'; // For Invoices
import InventoryIcon from '@mui/icons-material/Inventory'; // For Products/Services
import BarChartIcon from '@mui/icons-material/BarChart';
import LayersIcon from '@mui/icons-material/Layers';

import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
const NAVIGATION: Navigation = [
  { kind: 'header', title: 'Main' },
  { segment: '', title: 'Dashboard', icon: <DashboardIcon /> },

  { kind: 'divider' },

  { kind: 'header', title: 'Manage' },
  { segment: 'invoices', title: 'Invoices', icon: <ReceiptIcon /> },
  { segment: 'customers', title: 'Customers', icon: <PeopleIcon /> },
  { segment: 'products', title: 'Products/Services', icon: <InventoryIcon /> },
  { segment: 'configuration', title: 'Configuration', icon: <SettingsSuggestIcon /> },

  { kind: 'divider' },

  { kind: 'header', title: 'Analytics' },
  {
    segment: 'reports',
    title: 'Reports',
    icon: <BarChartIcon />,

  },
  { kind: 'divider' },

  { kind: 'header', title: 'Integrations' },
  {
    segment: 'integrations',
    title: 'Integrations (Coming Soon)',
    icon: <LayersIcon />,
  }
];

export default NAVIGATION;
