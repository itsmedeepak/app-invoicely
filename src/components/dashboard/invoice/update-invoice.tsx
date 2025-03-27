import React, { useRef } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    SelectChangeEvent,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";


const customers = [
    {
        name: "John Doe",
        totalDue: "$12,110.55",
        bank: "American Bank",
        country: "United States",
        iban: "ETD95476213874685",
        swift: "BR91905",
    },
    {
        name: "Jane Smith",
        totalDue: "$8,450.00",
        bank: "Global Trust",
        country: "Canada",
        iban: "CAN12345678901234",
        swift: "GT56789",
    },
];

// Dummy product data
const products = [
    { name: "App Design", cost: 24, hours: 1 },
    { name: "Website Development", cost: 30, hours: 5 },
    { name: "Consulting", cost: 50, hours: 2 },
];

const UpdateInvoice: React.FC = () => {
    const [paymentMethod, setPaymentMethod] = React.useState<string>("UPI Transfer");
    const [selectedCustomer, setSelectedCustomer] = React.useState<string>("");
    const [selectedProduct, setSelectedProduct] = React.useState<string>("");
    const [productList, setProductList] = React.useState<typeof products>([]);
    const invoiceRef = useRef<HTMLDivElement>(null);

    const handlePaymentChange = (event: SelectChangeEvent<string>) => {
        setPaymentMethod(event.target.value as string);
    };
    
    const handleCustomerChange = (event: SelectChangeEvent<string>) => {
        setSelectedCustomer(event.target.value);
    };
    
    const handleProductChange = (event: SelectChangeEvent<string>) => {
        setSelectedProduct(event.target.value as string);
    };

    const addProduct = () => {
        const product = products.find((p) => p.name === selectedProduct);
        if (product) {
            setProductList([...productList, product]);
            setSelectedProduct("");
        }
    };

    const removeProduct = (index: number) => {
        const updated = [...productList];
        updated.splice(index, 1);
        setProductList(updated);
    };

    const calculateTotal = () => {
        return productList.reduce((total, item) => total + item.cost * item.hours, 0);
    };

    const customerDetails = customers.find((cust) => cust.name === selectedCustomer);

    const downloadPDF = async () => {
        if (invoiceRef.current) {
            const canvas = await html2canvas(invoiceRef.current, {
                scale: 2,
            });
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.save("invoice.pdf");
        }
    };

    return (
        <Box sx={{ p: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5" fontWeight={500}>
                    Create Invoice
                </Typography>

            </Box>

            <Card sx={{  mx: "auto", p: 3, position: "relative" }}>
                <CardContent ref={invoiceRef} sx={{ position: "relative", zIndex: 1 }}>
                    {/* Header */}
                    {/* Header */}
                    <Box mb={3}>
                        <Grid container alignItems="center" justifyContent="space-between">
                            {/* Left Side: Invoice Text */}
                            <Grid item xs={12} sm={8}>
                                <Typography variant="h4" fontWeight="bold">
                                    Vuexy Invoice
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    Office 149, 450 South Brand Brooklyn
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    San Diego County, CA 91905, USA
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    +1 (123) 456 7891, +44 (876) 543 2198
                                </Typography>
                            </Grid>

                            {/* Right Side: Logo */}
                            <Grid item xs={12} sm={4} textAlign="right">
                                <img
                                    src="https://via.placeholder.com/120x60.png?text=Logo" // Replace with your logo URL
                                    alt="Company Logo"
                                    style={{ maxWidth: "120px", height: "auto" }}
                                />
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Invoice Details */}
                    <Grid container spacing={3} mb={3}>
                        <Grid item xs={12} sm={4}>
                            <TextField label="Invoice #" value="5037" fullWidth variant="outlined" InputProps={{ readOnly: true }} />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField label="Date Issued" value="03/19/2025" fullWidth variant="outlined" InputProps={{ readOnly: true }} />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField label="Date Due" value="03/26/2025" fullWidth variant="outlined" InputProps={{ readOnly: true }} />
                        </Grid>
                    </Grid>

                    {/* Customer Selection */}
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Select Customer</InputLabel>
                        <Select value={selectedCustomer} onChange={handleCustomerChange} label="Select Customer">
                            {customers.map((cust) => (
                                <MenuItem key={cust.name} value={cust.name}>
                                    {cust.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Bill To Info */}
                    {customerDetails && (
                        <Box mb={3}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Bill To: {customerDetails.name}
                            </Typography>
                            <Typography>Total Due: {customerDetails.totalDue}</Typography>
                            <Typography>Bank: {customerDetails.bank}</Typography>
                            <Typography>Country: {customerDetails.country}</Typography>
                            <Typography>IBAN: {customerDetails.iban}</Typography>
                            <Typography>SWIFT Code: {customerDetails.swift}</Typography>
                        </Box>
                    )}

                    {/* Products Table */}
                    {productList.length > 0 && (
                        <TableContainer component={Paper} sx={{ mb: 3 }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Item</TableCell>
                                        <TableCell align="right">Cost</TableCell>
                                        <TableCell align="right">Hours</TableCell>
                                        <TableCell align="right">Total</TableCell>
                                        <TableCell align="center">Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {productList.map((prod, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{prod.name}</TableCell>
                                            <TableCell align="right">${prod.cost}</TableCell>
                                            <TableCell align="right">{prod.hours}</TableCell>
                                            <TableCell align="right">${(prod.cost * prod.hours).toFixed(2)}</TableCell>
                                            <TableCell align="center">
                                                <IconButton onClick={() => removeProduct(index)} color="error">
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}

                    {/* Product Selection */}
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Select Product</InputLabel>
                        <Select value={selectedProduct} onChange={handleProductChange} label="Select Product">
                            {products.map((prod) => (
                                <MenuItem key={prod.name} value={prod.name}>
                                    {prod.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button variant="contained" onClick={addProduct} disabled={!selectedProduct} sx={{ mb: 3 }}>
                        Add Product
                    </Button>

                    {/* Salesperson */}
                    <Box mb={3}>
                        <TextField label="Salesperson" value="Tommy Shelby" fullWidth variant="outlined" InputProps={{ readOnly: true }} />
                    </Box>

                    {/* Payment Method */}
                    <FormControl fullWidth sx={{ mb: 3 }}>
                        <InputLabel>Accept Payments Via</InputLabel>
                        <Select value={paymentMethod} onChange={handlePaymentChange} label="Accept Payments Via">
                            <MenuItem value="UPI Transfer">UPI Transfer</MenuItem>
                            <MenuItem value="Internet Banking">Internet Banking</MenuItem>
                            <MenuItem value="Debit Card">Debit Card</MenuItem>
                            <MenuItem value="Credit Card">Credit Card</MenuItem>
                            <MenuItem value="Paypal">Paypal</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Total Amount */}
                    <Box mb={3}>
                        <Typography variant="h6" fontWeight="bold">
                            Total Amount: ${calculateTotal().toFixed(2)}
                        </Typography>
                    </Box>

                    {/* Action Buttons */}
                    <Box display="flex" gap={2} mb={3}>
                        <Button variant="contained" onClick={downloadPDF}>Export to PDF</Button>
                        <Button variant="outlined">Send Invoice</Button>
                        <Button variant="outlined">Save</Button>
                    </Box>

                    {/* Footer */}
                    <Typography variant="body2" color="text.secondary">
                        It was a pleasure working with you and your team. We hope you will keep us in mind for future freelance projects. Thank You!
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
};

export default UpdateInvoice;
