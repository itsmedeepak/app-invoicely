import React, { forwardRef, useRef, useState } from "react";
import {
    Box,
    Grid,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    TableContainer,
    Divider,
    useTheme,
    Button,
    Backdrop,
    CircularProgress,
} from "@mui/material";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { Customer, Product } from "../../../utils/types";
import html2canvas from "html2canvas";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_URL } from "../../../utils/config";
import { useNavigate } from "react-router-dom";

// Timestamp helper
const getCurrentTimestamp = () => {
    const now = new Date();
    return now.toLocaleString();
};

interface PreviewInvoiceProps {
    invoiceId: string;
    invoiceConfig: InvoiceConfig;
    issuedDate: string;
    dueDate: string;
    paymentStatus: string;
    selectedCustomer: Customer;
    addedProducts: Product[];
    paymentMethod: string;
    invoiceGeneratedBy: string;
    totalAmount: number;
    currencySymbol: string;
}

// Component
const PreviewInvoice = forwardRef<HTMLDivElement, PreviewInvoiceProps>((props, ref) => {
    const {
        invoiceId,
        invoiceConfig,
        issuedDate,
        dueDate,
        paymentStatus,
        selectedCustomer,
        addedProducts,
        paymentMethod,
        invoiceGeneratedBy,
        totalAmount,
        currencySymbol,
    } = props;

    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';
    const divRef = useRef<HTMLDivElement>(null);

    const userInfo = useSelector((state: RootState) => state.auth);
    const authToken = userInfo?.refreshToken;

    // State for loading spinner
    const [loading, setLoading] = useState(false);


    const getClodinaryUploadedUrl = async () => {
        if (divRef.current) {
            try {
                // Capture canvas image
                const canvas = await html2canvas(divRef.current);
                const image = canvas.toDataURL('image/png');

                // Convert base64 to Blob
                const blob = await fetch(image).then(res => res.blob());

                // Prepare FormData for Cloudinary upload
                const formData = new FormData();
                formData.append('file', blob);
                formData.append('upload_preset', 'invoice-upload');
                formData.append('folder', 'invoices');
                // Upload to Cloudinary
                const response = await fetch(`https://api.cloudinary.com/v1_1/ds3amr7w8/image/upload`, {
                    method: 'POST',
                    body: formData,
                });

                const data = await response.json();
                if (data.secure_url) {
                    console.log('✅ Cloudinary URL:', data.secure_url);
                    alert('Invoice uploaded successfully!');
                    return data.secure_url;
                } else {
                    console.error('❌ Upload failed:', data);
                    alert('Upload failed');
                    return null;
                }
            } catch (error) {
                console.error('🚨 Error uploading to Cloudinary:', error);
                alert('Error uploading to Cloudinary');
                return null;
            }
        }
    };


    const navigate = useNavigate();

    const handleDownloadPdf = async () => {
        if (divRef.current) {
            const canvas = await html2canvas(divRef.current);
            const image = canvas.toDataURL('image/png');

            // Create a link and trigger download
            const link = document.createElement('a');
            link.href = image;
            link.download = `${invoiceId}-invoice.png`;
            link.click();
        }
    };

    const handleSaveInvoice = async () => {
        setLoading(true); // Start loading
        
        try {
            const invoicePayload = {
                invoice_id: invoiceId,
                issued_date: issuedDate,
                due_date: dueDate,
                customer_id: selectedCustomer._id,
                invoice_no:invoiceId,
                invoice_url: null,
                logo_url:  invoiceConfig?.logo_url,
                products: addedProducts.map(prod => ({
                    product_id: prod._id,
                    name: prod.name,
                    price: prod.price,
                    quantity: prod.quantity,
                    discount: prod.discount,
                    currency: prod.currency,
                    final_price: prod.price - (prod.price * prod.discount) / 100,
                    total_price: (prod.price - (prod.price * prod.discount) / 100) * prod.quantity,
                })),
                customer: selectedCustomer,
                payment_method: paymentMethod,
                payment_status: paymentStatus,
                invoice_generated_by: invoiceGeneratedBy,
                total_amount: totalAmount,
                currency: addedProducts[0]?.currency || "USD", // fallback currency
            };

            const response = await axios.post(`${API_URL}/invoice`, invoicePayload, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (response.status === 200 || response.status === 201) {
                toast.success('Invoice saved successfully!'); // Show success toast
                setTimeout(() => navigate("/create-invoice"), 2000);
            } else {
                toast.error(response.data?.message); // Show error toast
            }
        } catch (error) {
            console.error('Error saving invoice:', error);
            toast.error(error.response.data?.message);  // Show error toast
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return (
        <>
            {/* Invoice Content */}
            <Box
                id="invoice-content"
                ref={divRef}
                sx={{
                    p: 4,
                    backgroundColor: isDarkMode ? 'background.paper' : '#f9f9f9',
                }}
            >
                {/* Company Info */}
                <Grid container justifyContent="space-between" alignItems="center" mb={2}>
                    <Grid item>
                        <Typography variant="h5" fontWeight="bold">{invoiceConfig?.name || "Invoice Company"}</Typography>
                        <Typography>{invoiceConfig?.address}</Typography>
                        <Typography>{invoiceConfig?.city}, {invoiceConfig?.country}</Typography>
                        <Typography>{invoiceConfig?.phone1}</Typography>
                        <Typography>{invoiceConfig?.email}</Typography>
                    </Grid>
                    <Grid item textAlign="right">
                        <Box
                            component="img"
                            src={invoiceConfig?.logo_url || "https://via.placeholder.com/120x60.png?text=Logo"}
                            sx={{ maxWidth: 120 }}
                        />
                    </Grid>
                </Grid>

                <Divider sx={{ mb: 3 }} />

                {/* Invoice Metadata */}
                <Grid container spacing={3} mb={3}>
                    <Grid item xs={4}>
                        <Typography variant="subtitle1"><strong>Invoice #:</strong> {invoiceId}</Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography variant="subtitle1"><strong>Issued:</strong> {new Date(issuedDate).toLocaleDateString()}</Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography variant="subtitle1"><strong>Due:</strong> {new Date(dueDate).toLocaleDateString()}</Typography>
                    </Grid>
                </Grid>

                {/* Customer Info */}
                <Box mb={3}>
                    <Typography variant="h6" gutterBottom>Bill To:</Typography>
                    <Typography>{selectedCustomer?.first_name} {selectedCustomer?.last_name}</Typography>
                    <Typography>{selectedCustomer?.street_address}</Typography>
                    <Typography>{selectedCustomer?.city}, {selectedCustomer?.state}, {selectedCustomer?.country}</Typography>
                    <Typography>{selectedCustomer?.email}</Typography>
                    <Typography>{selectedCustomer?.phone}</Typography>
                </Box>

                {/* Product Table */}
                <TableContainer component={Paper} sx={{ mb: 3, backgroundColor: isDarkMode ? 'background.paper' : '#f9f9f9' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Item</strong></TableCell>
                                <TableCell align="right"><strong>Price</strong></TableCell>
                                <TableCell align="right"><strong>Discount (%)</strong></TableCell>
                                <TableCell align="right"><strong>Qty</strong></TableCell>
                                <TableCell align="right"><strong>Final Price</strong></TableCell>
                                <TableCell align="right"><strong>Total</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {addedProducts.map((prod, i) => {
                                const finalPrice = prod.price - (prod.price * prod.discount) / 100;
                                const total = finalPrice * prod.quantity;
                                return (
                                    <TableRow key={i}>
                                        <TableCell>{prod.name}</TableCell>
                                        <TableCell align="right">{prod.currency} {prod.price.toFixed(2)}</TableCell>
                                        <TableCell align="right">{prod.discount}</TableCell>
                                        <TableCell align="right">{prod.quantity}</TableCell>
                                        <TableCell align="right">{prod.currency} {finalPrice.toFixed(2)}</TableCell>
                                        <TableCell align="right">{prod.currency} {total.toFixed(2)}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Payment Info and Total */}
                <Grid container spacing={2} mb={2}>
                    <Grid item xs={6}>
                        <Typography><strong>Payment Method:</strong> {paymentMethod}</Typography>
                        <Typography><strong>Payment Status:</strong> {paymentStatus}</Typography>
                        <Typography><strong>Generated By:</strong> {invoiceGeneratedBy}</Typography>
                    </Grid>
                    <Grid item xs={6} textAlign="right">
                        <Typography variant="h6">
                            Total: {currencySymbol} {totalAmount.toFixed(2)}
                        </Typography>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* Footer */}
                <Box textAlign="right">
                    <Typography variant="caption" color="text.secondary">
                        Generated on: {getCurrentTimestamp()}
                    </Typography>
                </Box>
            </Box>

            {/* Action Buttons */}
            <Box mt={3} textAlign="right" display="flex" justifyContent="flex-end" gap={2}>
                <Button variant="contained" sx={{ p: 1 }} onClick={handleSaveInvoice}>
                Send Invoice
                </Button>
                
                <Button variant="outlined" sx={{ p: 1 }} onClick={handleDownloadPdf}>
                    Download Invoice
                </Button>
            </Box>

            {/* Full-Screen Loader */}
            <Backdrop open={loading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <CircularProgress color="inherit" />
            </Backdrop>

            {/* React Toast Container */}
            <ToastContainer />
        </>
    );
});

export default PreviewInvoice;
