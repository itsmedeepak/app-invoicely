import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box, Button, Typography, IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../../utils/config';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';

interface Invoice {
  id: string;
  customerName: string;
  customerEmail: string;
  paymentDueDate: string;
  status: 'Payment Due' | 'Completed';
  totalAmount: number;
  createdAt: string;
}

const formatDate = (isoString: string) => {
  if (!isoString) return 'N/A';
  const date = new Date(isoString);
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
};

export const Invoices: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const navigate = useNavigate();
  const authToken = useSelector((state: RootState) => state.auth.refreshToken);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axios.get(`${API_URL}/invoice`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        const invoices = [...(response.data.data || [])].reverse();
        setInvoices(invoices.map((inv) => ({
          id: inv.invoice_id,
          customerName: `${inv.customer?.first_name || ''} ${inv.customer?.last_name || ''}`.trim(),
          customerEmail: inv.customer?.email || "N/A",
          totalAmount: inv.total_amount || 0,
          paymentDueDate: formatDate(inv.due_date),
          status: inv.payment_status === "Paid" ? "Completed" : "Payment Due",
          createdAt: formatDate(inv.created_at),
        })));

      } catch (error) {
        console.error("Error fetching invoices:", error);
      }
    };

    fetchInvoices();
  }, [authToken]);

  const handleOpenCreate = () => {
    navigate("/create-invoice");
  };



  const handleDeleteInvoice = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/invoice/${id}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setInvoices(invoices.filter(invoice => invoice.id !== id));
    } catch (error) {
      console.error("Error deleting invoice:", error);
    }
  };

  const columns: GridColDef[] = [
    { field: 'customerName', headerName: 'Customer Name', flex: 1, align: 'center', headerAlign: 'center' },
    { field: 'customerEmail', headerName: 'Email', flex: 1.5, align: 'center', headerAlign: 'center' },
    { field: 'totalAmount', headerName: 'Total', flex: 1, align: 'center', headerAlign: 'center' },
    { field: 'status', headerName: 'Status', flex: 1, align: 'center', headerAlign: 'center' },
    { field: 'paymentDueDate', headerName: 'Due Date', flex: 1, align: 'center', headerAlign: 'center' },
    { field: 'createdAt', headerName: 'Created At', flex: 1, align: 'center', headerAlign: 'center' },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Box display="flex" justifyContent="center" gap={1}>
          {/* <IconButton color="primary" onClick={() => handleEditInvoice(params.row.id)}>
            <EditIcon />
          </IconButton> */}
          <IconButton color="error" onClick={() => handleDeleteInvoice(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ p: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" fontWeight={500}>
          Invoices
        </Typography>
        <Button
          variant="contained"
          sx={{ px: 2, py: 1 }}
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
        >
          Create Invoice
        </Button>
      </Box>

      <Box sx={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={invoices}
          columns={columns}
          pageSizeOptions={[5, 10]}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10 },
            },
          }}
        />
      </Box>
    </Box>
  );
};
