import React, { useEffect, useState } from 'react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Stack,
    Container,
} from '@mui/material';
import PaymentIcon from '@mui/icons-material/Payment';
import ReceiptIcon from '@mui/icons-material/Receipt';
import SendIcon from '@mui/icons-material/Send';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import axios from 'axios';
import { API_URL } from '../../utils/config';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

// Import Chart.js and register necessary components
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const MetricCards = ({ metrics }) => (
    <Grid container spacing={3} mb={3}>
        {metrics.map((metric, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
                <Card elevation={3}>
                    <CardContent>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            {metric.icon}
                            <Box>
                                <Typography variant="subtitle1">{metric.title}</Typography>
                                <Typography variant="h5">{metric.value}</Typography>
                            </Box>
                        </Stack>
                    </CardContent>
                </Card>
            </Grid>
        ))}
    </Grid>
);

const Dashboard = () => {
    const [invoiceData, setInvoiceData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [metrics, setMetrics] = useState([
        { title: 'Pending Invoices', value: 0, icon: <ReceiptIcon color="warning" /> },
        { title: 'Paid Invoices', value: 0, icon: <PaymentIcon color="success" /> },
        { title: 'Today Sent', value: 0, icon: <SendIcon color="info" /> },
        { title: 'Payments Collected', value: 0, icon: <TrendingUpIcon color="primary" /> },
    ]);

    const authToken = useSelector((state: RootState) => state.auth.refreshToken);
    const currentYear = new Date().getFullYear();
    const allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    useEffect(() => {
        const fetchInvoices = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${API_URL}/invoice`, {
                    headers: { Authorization: `Bearer ${authToken}` },
                });

                if (response.data.success) {
                    const invoices = response.data.data || [];
                    setInvoiceData(invoices);

                    const todayISO = new Date().toISOString().split('T')[0]; // UTC date format
                    const paidInvoices = invoices.filter(i => i.payment_status === 'Paid').length;
                    const pendingInvoices = invoices.filter(i => i.payment_status !== 'Paid').length;
                    const totalRevenue = invoices.reduce((sum, i) => sum + i.total_amount, 0);
                    const todaySent = invoices.filter(i => new Date(i.created_at).toISOString().split('T')[0] === todayISO).length;

                    setMetrics([
                        { title: 'Pending Invoices', value: pendingInvoices, icon: <ReceiptIcon color="warning" /> },
                        { title: 'Paid Invoices', value: paidInvoices, icon: <PaymentIcon color="success" /> },
                        { title: 'Today Sent', value: todaySent, icon: <SendIcon color="info" /> },
                        { title: 'Payments Collected', value: totalRevenue, icon: <TrendingUpIcon color="primary" /> },
                    ]);
                }
            } catch (error) {
                console.error('Error fetching invoices:', error);
            }
            setLoading(false);
        };

        if (authToken) fetchInvoices();
    }, [authToken]);

    // Group revenue data by month
    const revenueByMonth = Array(12).fill(0); // Initialize an array with 12 zeros

    invoiceData.forEach(invoice => {
        const date = new Date(invoice.created_at);
        if (date.getUTCFullYear() === currentYear) {
            const monthIndex = date.getUTCMonth();
            revenueByMonth[monthIndex] += invoice.total_amount;
        }
    });

    const revenueData = {
        labels: allMonths,
        datasets: [
            {
                label: `Revenue (${currentYear})`,
                data: revenueByMonth,
                borderColor: '#1976d2',
                backgroundColor: 'rgba(25, 118, 210, 0.1)',
                fill: true,
                tension: 0.4,
            },
        ],
    };

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Typography variant="h5" gutterBottom>
                Invoicing Dashboard
            </Typography>

            {loading ? <Typography>Loading...</Typography> : <MetricCards metrics={metrics} />}

            <Card>
                <CardContent>
                <Typography variant="h6" gutterBottom>
    Monthly Revenue Trend for {currentYear}
</Typography>
                    <Box sx={{ height: 300 }}>
                        <Line data={revenueData} options={{ maintainAspectRatio: false }} />
                    </Box>
                </CardContent>
            </Card>
        </Container>
    );
};

export default Dashboard;
