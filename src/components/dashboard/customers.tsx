import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Grid,
    Typography,
    Backdrop,
    CircularProgress,
    useTheme,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { LoadingButton } from '@mui/lab';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { API_URL } from '../../utils/config';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type Customer = {
    customerId: string;
    userId: string;
    email: string;
    phone: string;
    streetAddress: string;
    city: string;
    state: string;
    country: string;
    firstName: string;
    lastName: string;
    createdAt: string;
    updatedAt: string;
};

const emptyFormValues = {
    customerId: '',
    userId: '',
    email: '',
    phone: '',
    streetAddress: '',
    city: '',
    state: '',
    country: '',
    firstName: '',
    lastName: '',
};

export const Customers: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formValues, setFormValues] = useState<Omit<Customer, 'createdAt' | 'updatedAt'>>(emptyFormValues);
    const [editCustomerId, setEditCustomerId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false); // loader state
    const [formLoading, setFormLoading] = useState(false); // button loading

    const authToken = useSelector((state: RootState) => state.auth.refreshToken);
    const theme = useTheme();

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/customer`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
    
            // Extract customers from response.data.data
            const customerList: Customer[] = response.data.data?.map((item: any) => ({
                customerId: item._id,
                userId: item.user_id,
                email: item.email,
                phone: item.phone,
                streetAddress: item.street_address,
                city: item.city,
                state: item.state,
                country: item.country,
                firstName: item.first_name,
                lastName: item.last_name,
                createdAt: item.created_at,
                updatedAt: item.updated_at,
            }));
    
            setCustomers(customerList);
        } catch (error) {
            console.error('Error fetching customers:', error);
            toast.error('Failed to fetch customers');
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleOpenCreate = () => {
        setFormValues(emptyFormValues);
        setIsEditing(false);
        setDialogOpen(true);
    };

    const handleOpenEdit = (customer: Customer) => {
        const {
            customerId,
            userId,
            email,
            phone,
            streetAddress,
            city,
            state,
            country,
            firstName,
            lastName,
        } = customer;
    
        setFormValues({
            customerId,
            userId,
            email,
            phone,
            streetAddress,
            city,
            state,
            country,
            firstName,
            lastName,
        });
    
        setEditCustomerId(customer.customerId);
        setIsEditing(true);
        setDialogOpen(true);
    };
    console.log("Fetched Customers:", customers);
    

    const handleDelete = async (id: string) => {
        setLoading(true);
        try {
            await axios.delete(`${API_URL}/customer/${id}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
            toast.success('Customer deleted');
            fetchCustomers();
        } catch (error) {
            console.error('Error deleting customer:', error);
            toast.error('Failed to delete customer');
            setLoading(false);
        }
    };
    const toSnakeCase = (values: typeof formValues) => ({
        email: values.email,
        phone: values.phone,
        street_address: values.streetAddress,
        city: values.city,
        state: values.state,
        country: values.country,
        first_name: values.firstName,
        last_name: values.lastName,
    });
    
    const handleFormSubmit = async () => {
        setFormLoading(true);
        const payload = toSnakeCase(formValues);
        try {
            if (isEditing && editCustomerId) {
                await axios.put(
                    `${API_URL}/customer/${editCustomerId}`,
                    payload,
                    {
                        headers: {
                            Authorization: `Bearer ${authToken}`,
                        },
                    }
                );
                toast.success('Customer updated');
            } else {
                await axios.post(`${API_URL}/customer`, payload, {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });
                toast.success('Customer created');
            }
            setDialogOpen(false);
            fetchCustomers();
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error('Failed to submit form');
        } finally {
            setFormLoading(false);
        }
    };

    const columns: GridColDef[] = [
        { field: 'firstName', headerName: 'First Name', flex: 1 },
        { field: 'lastName', headerName: 'Last Name', flex: 1 },
        { field: 'email', headerName: 'Email', flex: 2 },
        { field: 'phone', headerName: 'Phone', flex: 1 },
        { field: 'city', headerName: 'City', flex: 1 },
        { field: 'state', headerName: 'State', flex: 1 },
        { field: 'country', headerName: 'Country', flex: 1 },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 1.5,
            sortable: false,
            renderCell: (params) => (
                <Box display="flex" gap={1}>
                    <Button
                        onClick={() => handleOpenEdit(params.row)}
                        startIcon={<EditIcon />}
                        size="small"
                    >
                        Edit
                    </Button>
                    <Button
                        onClick={() => handleDelete(params.row.customerId)}
                        color="error"
                        startIcon={<DeleteIcon />}
                        size="small"
                    >
                        Delete
                    </Button>
                </Box>
            ),
        },
    ];

    return (
        <Box p={2}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5" fontWeight={500}>
                    Customers
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleOpenCreate}
                    sx={{p:1}}
                >
                    Add Customer
                </Button>
            </Box>

            <DataGrid
                rows={customers}
                getRowId={(row) => row.customerId}
                columns={columns}
                pageSizeOptions={[5, 10, 25, { value: -1, label: 'All' }]}
                initialState={{
                    pagination: { paginationModel: { pageSize: 10 } },
                }}
                autoHeight
            />

            {/* Form Dialog */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="md">
                <DialogTitle>{isEditing ? 'Edit Customer' : 'Add Customer'}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} mt={1}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="First Name"
                                fullWidth
                                value={formValues.firstName}
                                onChange={(e) =>
                                    setFormValues({ ...formValues, firstName: e.target.value })
                                }
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Last Name"
                                fullWidth
                                value={formValues.lastName}
                                onChange={(e) =>
                                    setFormValues({ ...formValues, lastName: e.target.value })
                                }
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Email"
                                fullWidth
                                value={formValues.email}
                                onChange={(e) =>
                                    setFormValues({ ...formValues, email: e.target.value })
                                }
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Phone"
                                fullWidth
                                value={formValues.phone}
                                onChange={(e) =>
                                    setFormValues({ ...formValues, phone: e.target.value })
                                }
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Street Address"
                                fullWidth
                                value={formValues.streetAddress}
                                onChange={(e) =>
                                    setFormValues({ ...formValues, streetAddress: e.target.value })
                                }
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                label="City"
                                fullWidth
                                value={formValues.city}
                                onChange={(e) =>
                                    setFormValues({ ...formValues, city: e.target.value })
                                }
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                label="State"
                                fullWidth
                                value={formValues.state}
                                onChange={(e) =>
                                    setFormValues({ ...formValues, state: e.target.value })
                                }
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                label="Country"
                                fullWidth
                                value={formValues.country}
                                onChange={(e) =>
                                    setFormValues({ ...formValues, country: e.target.value })
                                }
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <LoadingButton
                        loading={formLoading}
                        variant="contained"
                        onClick={handleFormSubmit}
                    >
                        {isEditing ? 'Update' : 'Create'}
                    </LoadingButton>
                </DialogActions>
            </Dialog>

            {/* Fullscreen Loader */}
            <Backdrop
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <CircularProgress
                    style={{
                        color: theme.palette.mode === "dark" ? "#90caf9" : "#1976d2",
                    }}
                />
            </Backdrop>

            {/* Toast Notifications */}
            <ToastContainer position="top-right" autoClose={3000} />
        </Box>
    );
};
