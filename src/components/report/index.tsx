import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  Container,
  Typography,
  Grid,
  Paper,
  useTheme,
  Button,
  Stack,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { BarChart, LineChart } from "@mui/x-charts";
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import DownloadIcon from "@mui/icons-material/Download";
import { RootState } from "../../store/store";
import { API_URL } from "../../utils/config";

const currencyFormatter = (value: number | null | undefined) => {
  if (value == null) return "N/A";
  return value.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
  });
};

function computeSalesData(invoices) {
  const now = new Date();
  const dailySales = {};

  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(now.getDate() - i);
    const dateKey = date.toISOString().split("T")[0];
    dailySales[dateKey] = { total: 0, pending: 0, paid: 0 };
  }

  invoices.forEach((invoice) => {
    const dateKey = invoice.issued_date.split("T")[0];

    if (!dailySales[dateKey]) {
      dailySales[dateKey] = { total: 0, pending: 0, paid: 0 };
    }

    if (invoice.payment_status === "Paid") {
      dailySales[dateKey].paid += invoice.total_amount;
    } else {
      dailySales[dateKey].pending += invoice.total_amount;
    }

    dailySales[dateKey].total += invoice.total_amount;
  });

  return dailySales;
}

function computeDailyInvoicesSent(invoices) {
  const now = new Date();
  const dailyInvoicesSent = {};

  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(now.getDate() - i);
    const dateKey = date.toISOString().split("T")[0];
    dailyInvoicesSent[dateKey] = 0;
  }

  invoices.forEach((invoice) => {
    const dateKey = invoice.issued_date.split("T")[0];
    dailyInvoicesSent[dateKey] = (dailyInvoicesSent[dateKey] || 0) + 1;
  });

  return dailyInvoicesSent;
}

const MonthlySalesBarChart: React.FC<{ data: any[] }> = ({ data }) => {
  const theme = useTheme();
  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" fontWeight={600} mb={2}>
        Weekly Sales Breakdown
      </Typography>
      <BarChart
        dataset={data}
        xAxis={[{ scaleType: "band", dataKey: "date" }]}
        yAxis={[{ label: "Sales (INR)" }]}
        series={[
          {
            type: "bar",
            dataKey: "pending",
            label: "Pending Sales",
            color: theme.palette.warning.main,
            valueFormatter: currencyFormatter,
          },
          {
            type: "bar",
            dataKey: "paid",
            label: "Paid Sales",
            color: theme.palette.success.main,
            valueFormatter: currencyFormatter,
          },
          {
            type: "bar",
            dataKey: "total",
            label: "Total Sales",
            color: theme.palette.primary.main,
            valueFormatter: currencyFormatter,
          },
        ]}
        height={350}
        sx={{
          width: "100%",
          [`& .${axisClasses.directionY} .${axisClasses.label}`]: {
            transform: "translateX(-10px)",
          },
        }}
      />
    </Paper>
  );
};

const DailyInvoiceLineChart: React.FC<{ data: any[] }> = ({ data }) => {
  const theme = useTheme();
  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" fontWeight={600} mb={2}>
        Daily Invoices Sent (Last 30 Days)
      </Typography>
      <LineChart
        xAxis={[{ scaleType: "point", data: data.map((d) => d.date) }]}
        yAxis={[{ label: "Invoices Sent" }]}
        series={[
          {
            data: data.map((d) => d.invoicesSent),
            label: "Invoices Sent",
            color: theme.palette.primary.main,
          },
        ]}
        height={300}
      />
    </Paper>
  );
};

const SalesAndInvoicesReport: React.FC = () => {
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [dailyData, setDailyData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const authToken = useSelector((state: RootState) => state.auth.refreshToken);

  useEffect(() => {
    const fetchInvoiceData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/invoice`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        const invoices = response.data.data;

        const salesData = computeSalesData(invoices);
        const invoicesSentData = computeDailyInvoicesSent(invoices);

        setMonthlyData(
          Object.keys(salesData).map((date) => ({
            date,
            ...salesData[date],
          }))
        );

        setDailyData(
          Object.keys(invoicesSentData).map((date) => ({
            date,
            invoicesSent: invoicesSentData[date],
          }))
        );
      } catch (error) {
        console.error("Error fetching invoice data:", error);
      }
      setLoading(false);
    };

    fetchInvoiceData();
  }, [authToken]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Fullscreen Backdrop Loader */}
      <Backdrop open={loading} sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={500}>
          Sales & Invoices Report
        </Typography>
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={() => alert("Download Report Feature Coming Soon")}
        >
          Export Report
        </Button>
      </Stack>

      <Grid container spacing={4} mb={4}>
        <Grid item xs={12}>
          <MonthlySalesBarChart data={monthlyData} />
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        <Grid item xs={12}>
          <DailyInvoiceLineChart data={dailyData} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default SalesAndInvoicesReport;
