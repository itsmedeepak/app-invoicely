import React, { useEffect, useState } from 'react';
import {
    Box, Button, Typography, Grid, Dialog, DialogTitle,
    DialogContent, TextField, Select, MenuItem, DialogActions,
    IconButton, Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import PanoramaIcon from '@mui/icons-material/Panorama';
import axios from 'axios';
import { API_URL } from '../../utils/config';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
// Add currency field in Product interface
interface Product {
    _id: string;
    user_id: string;
    name: string;
    category: string;
    price: number;
    discount: number;
    currency: string;
    product_image: string;
    created_at: string;
    updated_at: string;
}

// Top 30 currencies (ISO codes with country names for clarity)
const currencies = [
    { code: 'USD', name: 'US Dollar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'JPY', name: 'Japanese Yen' },
    { code: 'GBP', name: 'British Pound' },
    { code: 'AUD', name: 'Australian Dollar' },
    { code: 'CAD', name: 'Canadian Dollar' },
    { code: 'CHF', name: 'Swiss Franc' },
    { code: 'CNY', name: 'Chinese Yuan' },
    { code: 'INR', name: 'Indian Rupee' },
    { code: 'NZD', name: 'New Zealand Dollar' },
    { code: 'SGD', name: 'Singapore Dollar' },
    { code: 'KRW', name: 'South Korean Won' },
    { code: 'SEK', name: 'Swedish Krona' },
    { code: 'NOK', name: 'Norwegian Krone' },
    { code: 'MXN', name: 'Mexican Peso' },
    { code: 'RUB', name: 'Russian Ruble' },
    { code: 'ZAR', name: 'South African Rand' },
    { code: 'BRL', name: 'Brazilian Real' },
    { code: 'HKD', name: 'Hong Kong Dollar' },
    { code: 'IDR', name: 'Indonesian Rupiah' },
    { code: 'TRY', name: 'Turkish Lira' },
    { code: 'SAR', name: 'Saudi Riyal' },
    { code: 'AED', name: 'UAE Dirham' },
    { code: 'PLN', name: 'Polish Zloty' },
    { code: 'THB', name: 'Thai Baht' },
    { code: 'TWD', name: 'Taiwan Dollar' },
    { code: 'MYR', name: 'Malaysian Ringgit' },
    { code: 'DKK', name: 'Danish Krone' },
    { code: 'ILS', name: 'Israeli Shekel' },
    { code: 'EGP', name: 'Egyptian Pound' }
];

export const Products = () => {
    const [openCreate, setOpenCreate] = useState(false);
    const [imageView, setImageView] = useState<string | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const authToken = useSelector((state: RootState) => state.auth.refreshToken);

    const [formData, setFormData] = useState({
        name: '',
        category: '',
        price: '',
        discount: '',
        currency: '', 
        product_image: ''
    });

    const categories = ['Product', 'Service', 'Subscription', 'Consulting'];

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/product`, {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            setProducts(res.data.data);
        } catch (err) {
            console.error('Error fetching products:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleOpenCreate = () => {
        setFormData({
            name: '',
            category: '',
            price: '',
            discount: '',
            currency: 'USD',
            product_image: ''
        });
        setEditMode(false);
        setOpenCreate(true);
    };

    const handleCloseCreate = () => {
        setOpenCreate(false);
        setEditMode(false);
        setSelectedProduct(null);
    };

    const handleFormChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        try {
            const payload = {
                name: formData.name,
                category: formData.category,
                price: parseFloat(formData.price),
                discount: parseFloat(formData.discount),
                currency: formData.currency,
                product_image: formData.product_image
            };

            if (editMode && selectedProduct) {
                await axios.put(`${API_URL}/product/${selectedProduct._id}`, payload, {
                    headers: { Authorization: `Bearer ${authToken}` },
                });
            } else {
                await axios.post(`${API_URL}/product`, payload, {
                    headers: { Authorization: `Bearer ${authToken}` },
                });
            }

            await fetchProducts();
            handleCloseCreate();
        } catch (err) {
            console.error('Error saving product:', err);
        }
    };

    const handleEdit = (product: Product) => {
        setEditMode(true);
        setSelectedProduct(product);
        setFormData({
            name: product.name,
            category: product.category,
            price: product.price.toString(),
            discount: product.discount.toString(),
            currency: product.currency,
            product_image: product.product_image
        });
        setOpenCreate(true);
    };

    const handleDelete = async (id: string) => {
        try {
            await axios.delete(`${API_URL}/product/${id}`, {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            await fetchProducts();
        } catch (err) {
            console.error('Error deleting product:', err);
        }
    };

    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Name', flex: 1, align: 'center', headerAlign: 'center' },
        { field: 'category', headerName: 'Category', flex: 1, align: 'center', headerAlign: 'center' },
        { field: 'currency', headerName: 'Currency', flex: 1, align: 'center', headerAlign: 'center' },
        { field: 'price', headerName: 'Price', flex: 1, align: 'center', headerAlign: 'center' },
        { field: 'discount', headerName: 'Discount (%)', flex: 1, align: 'center', headerAlign: 'center' },
        {
            field: 'product_image',
            headerName: 'Image',
            flex: 1,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => (
                <Box display="flex" justifyContent="center">
                    <Tooltip title="View Image">
                        <IconButton onClick={() => setImageView(params.value)}>
                            <PanoramaIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            )
        },
        {
            field: 'actions',
            headerName: 'Actions',
            sortable: false,
            flex: 2,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => (
                <Box display="flex" justifyContent="center" gap={1}>
                    <Button size="small" onClick={() => handleEdit(params.row)} startIcon={<EditIcon />}>
                        Edit
                    </Button>
                    <Button size="small" color="error" onClick={() => handleDelete(params.row._id)} startIcon={<DeleteIcon />}>
                        Delete
                    </Button>
                </Box>
            )
        }
    ];

    return (
        <Box sx={{ p: 2 }}>
            {/* Header and Add Button */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5" fontWeight={500}>Products / Services</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreate}>
                    Add Product
                </Button>
            </Box>

            {/* Product Table */}
            <Box sx={{ height: 500, width: '100%', overflowX: 'auto' }}>
                <DataGrid
                    rows={products}
                    columns={columns}
                    getRowId={(row) => row._id}
                    loading={loading}
                    pageSizeOptions={[5, 10, 25, { value: -1, label: 'All' }]}
                    initialState={{
                        pagination: {
                            paginationModel: { pageSize: 10 }
                        }
                    }}
                />
            </Box>

            {/* Add / Edit Dialog */}
            <Dialog open={openCreate} onClose={handleCloseCreate} maxWidth="sm" fullWidth>
                <DialogTitle>{editMode ? 'Edit Product' : 'Add Product'}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} mt={1}>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Name" value={formData.name}
                                onChange={(e) => handleFormChange('name', e.target.value)} />
                        </Grid>
                        <Grid item xs={12}>
                            <Select fullWidth value={formData.category} displayEmpty
                                onChange={(e) => handleFormChange('category', e.target.value)}>
                                <MenuItem value="" disabled>Select Category</MenuItem>
                                {categories.map((cat) => (
                                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                                ))}
                            </Select>
                        </Grid>
                        <Grid item xs={12}>
                            <Select fullWidth value={formData.currency} displayEmpty
                                onChange={(e) => handleFormChange('currency', e.target.value)}>
                                <MenuItem value="" disabled>Select Currency</MenuItem>
                                {currencies.map((cur) => (
                                    <MenuItem key={cur.code} value={cur.code}>{`${cur.code} - ${cur.name}`}</MenuItem>
                                ))}
                            </Select>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Price" type="number"
                                value={formData.price}
                                onChange={(e) => handleFormChange('price', e.target.value)} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Discount (%)" type="number"
                                value={formData.discount}
                                onChange={(e) => handleFormChange('discount', e.target.value)} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Product Image URL"
                                value={formData.product_image}
                                onChange={(e) => handleFormChange('product_image', e.target.value)} />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseCreate}>Cancel</Button>
                    <Button variant="contained" onClick={handleSave}>Save</Button>
                </DialogActions>
            </Dialog>

            {/* Image View Dialog */}
            <Dialog open={Boolean(imageView)} onClose={() => setImageView(null)} maxWidth="sm" fullWidth>
                <DialogTitle>Product Image</DialogTitle>
                <DialogContent>
                    <Box display="flex" justifyContent="center">
                        <img src={imageView || ''} alt="Product" style={{ maxWidth: '100%', borderRadius: 8 }} />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setImageView(null)}>Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};