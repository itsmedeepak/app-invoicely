import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Stack,
  Divider,
  Chip,
  
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import PieChartIcon from "@mui/icons-material/PieChart";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

import axios from "axios";
import { toast } from "react-toastify";
import { API_URL } from "../../../utils/config";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';

// Interfaces
interface BillingInfo {
  _id?: string;
  full_name: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  email: string;
}

interface SubscriptionInfo {
  user_id: string;
  plan: string;
  valid_till: string;
  status: string;
  credits_used: number;
  credits_remaining: number;
  average_daily_usage: number;
  last_refreshed: string;
  created_at: string;
  updated_at: string;
}

const Subscription: React.FC = () => {
 
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [billingInfo, setBillingInfo] = useState<BillingInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingBilling, setSavingBilling] = useState(false);
  const [openBillingDialog, setOpenBillingDialog] = useState(false);

  const userInfo = useSelector((state: RootState) => state.auth);
  const authToken = userInfo.refreshToken;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        let subData: SubscriptionInfo | null = null;
        let billData: BillingInfo | null = null;

        try {
          const subRes = await axios.get(`${API_URL}/subscription`, {
            headers: { Authorization: `Bearer ${authToken}` },
          });
          subData = subRes.data?.data;
        } catch (subErr) {
          console.error("Subscription fetch failed:", subErr);
          toast.error("Failed to fetch subscription data.");
        }

        try {
          const billRes = await axios.get(`${API_URL}/billing`, {
            headers: { Authorization: `Bearer ${authToken}` },
          });
          billData = billRes.data?.data;
        } catch (billErr) {
          console.error("Billing fetch failed:", billErr);
          toast.error("Failed to fetch billing data.");
        }

        setSubscription(subData);
        setBillingInfo(billData || null);
      } catch (err) {
        console.error("Unexpected Error:", err);
        toast.error("Unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    if (authToken) {
      fetchData();
    } else {
      console.warn("No authToken available.");
      setLoading(false);
    }
  }, [authToken]);

  const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!billingInfo) return;
    setBillingInfo({ ...billingInfo, [e.target.name]: e.target.value });
  };

  const handleBillingSave = async () => {
    if (!billingInfo) return;
    try {
      setSavingBilling(true);
      const method = billingInfo._id ? "put" : "post";
      const url = `${API_URL}/billing${method === "put" ? `/${billingInfo._id}` : ""}`;

      await axios[method](url, billingInfo, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      toast.success("Billing information saved!");
      setOpenBillingDialog(false);
    } catch (err) {
      console.error("Billing save failed:", err);
      toast.error("Failed to save billing info");
    } finally {
      setSavingBilling(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  // Ensure subscription is not null
  if (!subscription) {
    return (
      <Box p={4}>
        <Typography variant="h6">No subscription data available.</Typography>
      </Box>
    );
  }

  const {
    plan,
    valid_till,
    status,
    credits_used,
    credits_remaining,
    average_daily_usage,
  } = subscription;

  const isActive = status?.toLowerCase() === "active";
  const totalCredits = credits_used + credits_remaining;
  const percentageUsed = totalCredits > 0 ? (credits_used / totalCredits) * 100 : 0;



  const openDialogForEdit = () => {
    setBillingInfo((prev) => prev || {
      full_name: "",
      address_line1: "",
      address_line2: "",
      city: "",
      state: "",
      zip: "",
      country: "",
      email: "",
    });
    setOpenBillingDialog(true);
  };

  const openDialogForAdd = () => {
    setBillingInfo({
      full_name: "",
      address_line1: "",
      address_line2: "",
      city: "",
      state: "",
      zip: "",
      country: "",
      email: "",
    });
    setOpenBillingDialog(true);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" fontWeight={500}>
          Subscription
        </Typography>
      </Box>

      <Grid container spacing={4} alignItems="stretch">
        {/* Current Plan */}
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6">Current Plan</Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                Plan: <strong>{plan}</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Valid Till: <strong>{new Date(valid_till).toDateString()}</strong>
              </Typography>
              <Chip
                label={isActive ? "Active" : "Expired"}
                color={isActive ? "success" : "error"}
                sx={{ mt: 2 }}
              />
              <Divider sx={{ my: 2 }} />
              <Stack direction="row" spacing={2}>
                <Button variant="contained" color="primary">
                  Upgrade Plan
                </Button>
                <Button variant="outlined" color="secondary">
                  Cancel Subscription
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Credit Usage */}
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                <PieChartIcon color="primary" />
                <Typography variant="h6">Credit Usage</Typography>
              </Stack>

              <Box display="flex" justifyContent="center" alignItems="center" mt={2} mb={2}>
                <Gauge
                  value={credits_remaining}
                  valueMax={totalCredits}
                  startAngle={-110}
                  endAngle={110}
                  width={200}      // Fixed width
                  height={120}     // Fixed height
                  sx={{
                    [`& .${gaugeClasses.valueText}`]: {
                      fontSize: 24,
                      transform: 'translate(0px, 0px)',
                    },
                  }}
                  text={({ value, valueMax }) => `${value} / ${valueMax}`}
                />
              </Box>

              <Typography variant="body2" align="center" sx={{ mt: 1 }}>
                You’ve used <strong>{percentageUsed.toFixed(1)}%</strong> of your available credits.
              </Typography>

              <Stack direction="row" justifyContent="space-between" mt={2}>
                <Typography variant="body2" color="text.secondary">
                  Used: <strong>{credits_used}</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Remaining: <strong>{credits_remaining}</strong>
                </Typography>
              </Stack>
            </CardContent>

          </Card>
        </Grid>

        {/* Usage Insights */}
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                <TrendingUpIcon color="primary" />
                <Typography variant="h6">Usage Insights</Typography>
              </Stack>
              <Typography variant="body2" sx={{ mb: 1 }}>
                You’ve used <strong>{percentageUsed.toFixed(1)}%</strong> of your credits.
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Average daily usage:{" "}
                <strong>
                  {typeof average_daily_usage === "number"
                    ? `${average_daily_usage.toFixed(1)} credits/day`
                    : "N/A"}
                </strong>
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Button variant="outlined" size="small">
                View Detailed Report
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Billing Info */}
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Billing Information
              </Typography>

              {billingInfo ? (
                <>
                  <Typography variant="body2">
                    Name: <strong>{billingInfo.full_name}</strong>
                  </Typography>
                  <Typography variant="body2">
                    Address:{" "}
                    <strong>
                      {billingInfo.address_line1}
                      {billingInfo.address_line2 ? `, ${billingInfo.address_line2}` : ""}
                    </strong>
                  </Typography>
                  <Typography variant="body2">
                    City: <strong>{billingInfo.city}</strong>
                  </Typography>
                  <Typography variant="body2">
                    State: <strong>{billingInfo.state}</strong>
                  </Typography>
                  <Typography variant="body2">
                    ZIP: <strong>{billingInfo.zip}</strong>
                  </Typography>
                  <Typography variant="body2">
                    Country: <strong>{billingInfo.country}</strong>
                  </Typography>
                  <Typography variant="body2">
                    Email: <strong>{billingInfo.email}</strong>
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Button variant="outlined" size="small" onClick={openDialogForEdit}>
                    Update Billing Info
                  </Button>
                </>
              ) : (
                <>
                  <Typography variant="body2" color="text.secondary">
                    No billing information available.
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Button variant="contained" size="small" onClick={openDialogForAdd}>
                    Add Billing Info
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Billing Dialog */}
      <Dialog open={openBillingDialog} onClose={() => setOpenBillingDialog(false)}>
        <DialogTitle>Billing Information</DialogTitle>
        <DialogContent>
          {[
            { label: "Full Name", name: "full_name" },
            { label: "Address Line 1", name: "address_line1" },
            { label: "Address Line 2", name: "address_line2" },
            { label: "City", name: "city" },
            { label: "State", name: "state" },
            { label: "ZIP", name: "zip" },
            { label: "Country", name: "country" },
            { label: "Email", name: "email" },
          ].map((field) => (
            <TextField
              key={field.name}
              margin="dense"
              label={field.label}
              name={field.name}
              fullWidth
              variant="outlined"
              value={billingInfo ? billingInfo[field.name as keyof BillingInfo] : ""}
              onChange={handleBillingChange}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBillingDialog(false)}>Cancel</Button>
          <Button onClick={handleBillingSave} disabled={savingBilling}>
            {savingBilling ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Subscription;
