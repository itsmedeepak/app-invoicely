import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Stack,
  Divider,
  useTheme,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import PaymentIcon from "@mui/icons-material/Payment";

const ManageBilling: React.FC = () => {
  const theme = useTheme();

  // Billing Address State
  const [billingInfo, setBillingInfo] = useState({
    fullName: "John Doe",
    addressLine1: "123 Main Street",
    addressLine2: "",
    city: "San Francisco",
    state: "CA",
    zip: "94101",
    country: "USA",
  });

  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  // Payment Method State (Mock)
  const [paymentMethod, setPaymentMethod] = useState("Visa •••• 1234");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBillingInfo({ ...billingInfo, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setEditing(false);
    setSaved(true);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Manage Billing
      </Typography>

      <GridContainer>
        {/* Billing Address */}
        <CardBlock icon={<HomeIcon color="primary" />} title="Billing Address">
          <Stack spacing={2}>
            <TextField
              label="Full Name"
              name="fullName"
              value={billingInfo.fullName}
              onChange={handleChange}
              disabled={!editing}
              fullWidth
            />
            <TextField
              label="Address Line 1"
              name="addressLine1"
              value={billingInfo.addressLine1}
              onChange={handleChange}
              disabled={!editing}
              fullWidth
            />
            <TextField
              label="Address Line 2"
              name="addressLine2"
              value={billingInfo.addressLine2}
              onChange={handleChange}
              disabled={!editing}
              fullWidth
            />
            <Stack direction="row" spacing={2}>
              <TextField
                label="City"
                name="city"
                value={billingInfo.city}
                onChange={handleChange}
                disabled={!editing}
                fullWidth
              />
              <TextField
                label="State"
                name="state"
                value={billingInfo.state}
                onChange={handleChange}
                disabled={!editing}
                fullWidth
              />
            </Stack>
            <Stack direction="row" spacing={2}>
              <TextField
                label="ZIP"
                name="zip"
                value={billingInfo.zip}
                onChange={handleChange}
                disabled={!editing}
                fullWidth
              />
              <TextField
                label="Country"
                name="country"
                value={billingInfo.country}
                onChange={handleChange}
                disabled={!editing}
                fullWidth
              />
            </Stack>

            <Stack direction="row" spacing={2} mt={2}>
              {editing ? (
                <Button variant="contained" onClick={handleSave}>
                  Save Address
                </Button>
              ) : (
                <Button variant="outlined" onClick={() => setEditing(true)}>
                  Edit Address
                </Button>
              )}
            </Stack>
          </Stack>
        </CardBlock>

        {/* Payment Method */}
        <CardBlock icon={<PaymentIcon color="primary" />} title="Payment Method">
          <Typography variant="body1" mb={2}>
            Current Method: <strong>{paymentMethod}</strong>
          </Typography>
          <TextField
            select
            label="Change Payment Method"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            fullWidth
          >
            <MenuItem value="Visa •••• 1234">Visa •••• 1234</MenuItem>
            <MenuItem value="MasterCard •••• 5678">MasterCard •••• 5678</MenuItem>
            <MenuItem value="PayPal">PayPal</MenuItem>
          </TextField>

          <Button variant="outlined" sx={{ mt: 2 }}>
            Update Payment
          </Button>
        </CardBlock>
      </GridContainer>

      <Snackbar
        open={saved}
        autoHideDuration={3000}
        onClose={() => setSaved(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" variant="filled" onClose={() => setSaved(false)}>
          Billing address updated successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ManageBilling;

// Utility: Grid Container
const GridContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Box sx={{ display: "grid", gap: 4, gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" } }}>
    {children}
  </Box>
);

// Utility: Card Wrapper
const CardBlock: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({
  icon,
  title,
  children,
}) => (
  <Card elevation={3} sx={{ p: 2 }}>
    <CardContent>
      <Stack direction="row" alignItems="center" spacing={1} mb={2}>
        {icon}
        <Typography variant="h6">{title}</Typography>
      </Stack>
      <Divider sx={{ mb: 2 }} />
      {children}
    </CardContent>
  </Card>
);
