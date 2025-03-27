import React, {useEffect, useState } from "react";
import {
    Box, Card, CardContent, Typography, TextField, Button, Select,
    MenuItem, InputLabel, FormControl, Grid, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import axios from "axios";
import { API_URL } from "../../../utils/config";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Dialog, DialogContent } from "@mui/material";
import PreviewInvoice from "./preview-invoice";

interface Customer {
    _id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    street_address: string;
    city: string;
    state: string;
    country: string;
}

interface Product {
    _id: string;
    name: string;
    price: number;
    category: string;
    currency: string;
    discount: number;
}

interface ProductWithQuantity extends Product {
    quantity: number;
}

interface InvoiceConfig {
    name: string;
    address: string;
    city: string;
    phone1: string;
    phone2: string;
    email: string;
    logo_url: string;
    country: string;
    user_id: string;
    created_at: string;
    updated_at: string;
}

function generateInvoiceId(): string {
    const timestampPart = Date.now().toString().slice(-3);
    const randomPart = Math.floor(10 + Math.random() * 90).toString();
    return timestampPart + randomPart;
}

const CreateInvoice: React.FC = () => {
    const [paymentMethod, setPaymentMethod] = useState<string>("UPI Transfer");
    const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
    const [selectedProductId, setSelectedProductId] = useState<string>("");
    const [customerList, setCustomerList] = useState<Customer[]>([]);
    const [productList, setProductList] = useState<Product[]>([]);
    const [addedProducts, setAddedProducts] = useState<ProductWithQuantity[]>([]);
    const [invoiceConfig, setInvoiceConfig] = useState<InvoiceConfig | null>(null);
    const [invoiceGeneratedBy, SetInvoiceGeneratedBy] = useState<string | null>(null);
    const [openPreview, setOpenPreview] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
    const [invoiceId, setInvoiceId] = useState<string | null>("")

    const authToken = useSelector((state: RootState) => state.auth.refreshToken);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const customerRes = await axios.get(`${API_URL}/customer`, {
                    headers: { Authorization: `Bearer ${authToken}` },
                });
                setCustomerList(customerRes.data.data);

                const productRes = await axios.get(`${API_URL}/product`, {
                    headers: { Authorization: `Bearer ${authToken}` },
                });
                setProductList(productRes.data.data);

                const configRes = await axios.get(`${API_URL}/invoice-config`, {
                    headers: { Authorization: `Bearer ${authToken}` },
                });
                setInvoiceConfig(configRes.data.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
        setInvoiceId(generateInvoiceId())
    }, [authToken]);

    const selectedCustomer = customerList.find(cust => cust._id === selectedCustomerId);
    const [issuedDate, setIssuedDate] = useState<Date | null>(new Date());
    const [dueDate, setDueDate] = useState<Date | null>(new Date());
    const [quantity, setQuantity] = useState<number>(1);


    const addProduct = () => {
        const product = productList.find((prod) => prod._id === selectedProductId);
        if (product) {
            const newProduct: ProductWithQuantity = { ...product, quantity };
            setAddedProducts(prev => [...prev, newProduct]);
            setSelectedProductId('');
            setQuantity(1);
        }
    };

    const removeProduct = (index: number) => {
        setAddedProducts(prev => prev.filter((_, i) => i !== index));
    };

    const calculateTotal = () => {
        return addedProducts.reduce((total, item) => {
            const discountedPrice = Math.max(0, item.price - (item.price * (item.discount ?? 0)) / 100);
            console.log(discountedPrice)
            return total + (discountedPrice * item.quantity);
        }, 0);
    };


    const currencySymbol = addedProducts[0]?.currency || "₹";


    return (
        <Box sx={{ p: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5" fontWeight={500}>Create Invoice</Typography>
            </Box>

            <Card sx={{ mx: "auto", p: 3, position: "relative" }}>
                <CardContent sx={{ position: "relative", zIndex: 1 }}>
                    {/* Header */}
                    <Box mb={3} p={2} sx={{ border: '1px solid #ccc', borderRadius: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={8}>
                                <Typography variant="h5" fontWeight="bold">
                                    {invoiceConfig?.name || "Invoice Company"}
                                </Typography>
                                {invoiceConfig?.address && (
                                    <Typography variant="body2" color="text.secondary">
                                        {invoiceConfig.address}
                                    </Typography>
                                )}
                                {(invoiceConfig?.city || invoiceConfig?.country) && (
                                    <Typography variant="body2" color="text.secondary">
                                        {invoiceConfig.city} {invoiceConfig.country}
                                    </Typography>
                                )}
                                {invoiceConfig?.phone1 && (
                                    <Typography variant="body2" color="text.secondary">
                                        {invoiceConfig.phone1}{invoiceConfig.phone2 ? `, ${invoiceConfig.phone2}` : ""}
                                    </Typography>
                                )}
                                {invoiceConfig?.email && (
                                    <Typography variant="body2" color="text.secondary">
                                        {invoiceConfig.email}
                                    </Typography>
                                )}
                            </Grid>
                            <Grid item xs={12} sm={4} textAlign={{ xs: "left", sm: "right" }}>
                                <Box
                                    component="img"
                                    src={invoiceConfig?.logo_url || "https://via.placeholder.com/120x60.png?text=Logo"}
                                    alt="Company Logo"
                                    sx={{ maxWidth: 120, height: "auto" }}
                                />
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Invoice Details */}
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Grid container spacing={3} mb={3}>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    label="Invoice #"
                                    value={invoiceId}
                                    fullWidth
                                    variant="outlined"
                                    InputProps={{ readOnly: true }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <DatePicker
                                    label="Date Issued"
                                    value={issuedDate}
                                    onChange={(newValue) => setIssuedDate(newValue)}
                                    slotProps={{ textField: { fullWidth: true } }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <DatePicker
                                    label="Date Due"
                                    value={dueDate}
                                    onChange={(newValue) => setDueDate(newValue)}
                                    slotProps={{ textField: { fullWidth: true } }}
                                />
                            </Grid>
                        </Grid>
                    </LocalizationProvider>

                    {/* Customer Selection */}
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Select Customer</InputLabel>
                        <Select value={selectedCustomerId} onChange={(e) => setSelectedCustomerId(e.target.value)} label="Select Customer">
                            {customerList.map((cust) => (
                                <MenuItem key={cust._id} value={cust._id}>
                                    {cust.first_name} {cust.last_name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Bill To Info */}
                    {selectedCustomer && (
                        <Box mb={3} p={2} sx={{ border: '1px solid #ccc', borderRadius: 2 }}>
                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                Bill To: {selectedCustomer.first_name} {selectedCustomer.last_name}
                            </Typography>
                            {selectedCustomer.email && (
                                <Typography variant="body2" color="text.secondary">
                                    {selectedCustomer.email}
                                </Typography>
                            )}
                            {selectedCustomer.phone && (
                                <Typography variant="body2" color="text.secondary">
                                    {selectedCustomer.phone}
                                </Typography>
                            )}
                            <Typography variant="body2" color="text.secondary">
                                {selectedCustomer.street_address},
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {selectedCustomer.city}, {selectedCustomer.state}, {selectedCustomer.country}
                            </Typography>
                        </Box>
                    )}

                    {/* Products Table */}
                    {addedProducts.length > 0 && (
                        <TableContainer component={Paper} sx={{ mb: 3 }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Item</TableCell>
                                        <TableCell align="right">Price</TableCell>
                                        <TableCell align="right">Discount (%)</TableCell>
                                        <TableCell align="right">Qty</TableCell>
                                        <TableCell align="right">Final Price</TableCell>
                                        <TableCell align="right">Total Price</TableCell>
                                        <TableCell align="center">Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {addedProducts.map((prod, index) => {
                                        const finalPrice = prod.price - (prod.price * prod.discount) / 100;
                                        const totalPrice = finalPrice * prod.quantity;
                                        return (
                                            <TableRow key={index}>
                                                <TableCell>{prod.name}</TableCell>
                                                <TableCell align="right">{prod.currency} {prod.price}</TableCell>
                                                <TableCell align="right">{prod.discount}</TableCell>
                                                <TableCell align="right">{prod.quantity}</TableCell>
                                                <TableCell align="right">{prod.currency} {finalPrice.toFixed(2)}</TableCell>
                                                <TableCell align="right">{prod.currency} {totalPrice.toFixed(2)}</TableCell>
                                                <TableCell align="center">
                                                    <IconButton onClick={() => removeProduct(index)} color="error">
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}

                    {/* Product Selection */}
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Select Product</InputLabel>
                        <Select value={selectedProductId} onChange={(e) => setSelectedProductId(e.target.value)} label="Select Product">
                            {productList.map((prod) => (
                                <MenuItem key={prod._id} value={prod._id}>
                                    {prod.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        label="Quantity"
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        fullWidth
                        sx={{ mb: 2 }}
                        inputProps={{ min: 1 }}
                    />
                    <Box mt={3} textAlign="right">
                        <Button variant="contained" onClick={addProduct} sx={{ mb: 3, }}>
                            Add Product
                        </Button>
                    </Box>
                    {/* Payment Summary */}
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Payment Method</InputLabel>
                        <Select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} label="Payment Method">
                            <MenuItem value="UPI Transfer">UPI Transfer</MenuItem>
                            <MenuItem value="Credit Card">Credit Card</MenuItem>
                            <MenuItem value="Debit Card">Debit Card</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl fullWidth sx={{ mb: 3 }}>
                        <InputLabel id="payment-status-label">Payment Status</InputLabel>
                        <Select
                            labelId="payment-status-label"
                            value={paymentStatus}
                            label="Payment Status"
                            onChange={(e) => setPaymentStatus(e.target.value)}
                        >
                            <MenuItem value="Due">Due</MenuItem>
                            <MenuItem value="Paid">Paid</MenuItem>
                        </Select>
                    </FormControl>


                    <TextField
                        label="Invoice Generated By"
                        type="text"
                        value={invoiceGeneratedBy}
                        onChange={(e) => SetInvoiceGeneratedBy(e.target.value)}
                        fullWidth
                        sx={{ mb: 2 }}

                    />


                    <Typography variant="h6" align="right">
                        Total: {currencySymbol} {calculateTotal().toFixed(2)}
                    </Typography>
                </CardContent>

                <Box mt={3} textAlign="right" display="flex" justifyContent="flex-end" gap={2}>

                    <Button variant="contained" sx={{ p: 1 }} onClick={() => setOpenPreview(true)}>
                        Preview Invoice
                    </Button>
                </Box>

                <Dialog open={openPreview} onClose={() => setOpenPreview(false)} fullWidth maxWidth="md">
                    <DialogContent>
                        <PreviewInvoice
                            invoiceId={invoiceId}
                            invoiceConfig={invoiceConfig}
                            issuedDate={issuedDate ? issuedDate.toLocaleDateString() : ''}
                            dueDate={dueDate ? dueDate.toLocaleDateString() : ''}
                            paymentStatus={paymentStatus}
                            selectedCustomer={selectedCustomer}
                            addedProducts={addedProducts}
                            paymentMethod={paymentMethod}
                            invoiceGeneratedBy={invoiceGeneratedBy}
                            totalAmount={calculateTotal()}
                            currencySymbol={currencySymbol}
                        />
                    </DialogContent>
                </Dialog>


            </Card>
        </Box>
    );
};

export default CreateInvoice;
