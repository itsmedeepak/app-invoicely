import React, { useState, ChangeEvent, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Container,
  Avatar,
  Backdrop,
  CircularProgress,
  useTheme,
} from "@mui/material";
import { useSelector } from "react-redux";
import axios from "axios";
import { RootState } from "../../store/store";
import { API_URL } from "../../utils/config";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';  // Import styles

interface InvoiceInfo {
  name: string;
  address: string;
  city: string;
  phone1: string;
  phone2: string;
  email: string;
  logo_url: string;
  country:string;
}

const InvoiceConfiguration: React.FC = () => {
  const [invoiceInfo, setInvoiceInfo] = useState<InvoiceInfo>({
    name: "",
    address: "",
    city: "",
    phone1: "",
    phone2: "",
    email: "",
    logo_url: "",
    country:""
  });

  const theme = useTheme();
  const [isEditable, setIsEditable] = useState(false);
  const [initialInfo, setInitialInfo] = useState<InvoiceInfo>(invoiceInfo);
  const [loading, setLoading] = useState(false);

  const userInfo = useSelector((state: RootState) => state.auth);
  const authToken = userInfo.refreshToken;

  useEffect(() => {
    const fetchInvoiceConfig = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/invoice-config`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
  
        if (response.data && response.data.data) {
          const apiData = response.data.data;
  
          // Fill missing fields like logoUrl if not present
          const filledData: InvoiceInfo = {
            name: apiData.name || "",
            address: apiData.address || "",
            city: apiData.city || "",
            phone1: apiData.phone1 || "",
            phone2: apiData.phone2 || "",
            email: apiData.email || "",
            country:apiData.country || "",
            logo_url: apiData.logo_url || "" // Handle undefined
          };
  
          setInvoiceInfo(filledData);
          setInitialInfo(filledData);
        }
      } catch (error) {
        console.error("Failed to fetch invoice config:", error);
        // toast.error("Failed to load invoice configuration.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchInvoiceConfig();
  }, [authToken]);
  

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInvoiceInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/invoice-config`, invoiceInfo, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      console.log("Saved Config:", response.data);
      toast.success("Invoice configuration saved successfully!");
      setInitialInfo(invoiceInfo);
      setIsEditable(false);
    } catch (error) {
      console.error("Failed to save invoice config:", error);
      toast.error("Failed to save invoice configuration.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setInvoiceInfo(initialInfo);
    setIsEditable(false);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h5" gutterBottom>
        Invoice Configuration
      </Typography>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Company Name"
                name="name"
                value={invoiceInfo.name}
                onChange={handleChange}
                fullWidth
                disabled={!isEditable}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Address"
                name="address"
                value={invoiceInfo.address}
                onChange={handleChange}
                fullWidth
                disabled={!isEditable}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="City / State / Zip"
                name="city"
                value={invoiceInfo.city}
                onChange={handleChange}
                fullWidth
                disabled={!isEditable}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Country"
                name="country"
                value={invoiceInfo.country}
                onChange={handleChange}
                fullWidth
                disabled={!isEditable}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Phone 1"
                name="phone1"
                value={invoiceInfo.phone1}
                onChange={handleChange}
                fullWidth
                disabled={!isEditable}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Phone 2"
                name="phone2"
                value={invoiceInfo.phone2}
                onChange={handleChange}
                fullWidth
                disabled={!isEditable}
              />
            </Grid>

            {/* Email + Logo URL + Preview Side-by-Side */}
            <Grid item xs={8}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Official Email"
                    name="email"
                    value={invoiceInfo.email}
                    onChange={handleChange}
                    fullWidth
                    disabled={!isEditable}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Logo URL"
                    name="logo_url"
                    value={invoiceInfo.logo_url}
                    onChange={handleChange}
                    fullWidth
                    disabled={!isEditable}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={4} display="flex" flexDirection="column" alignItems="center" justifyContent="center">
              <Typography variant="subtitle1" gutterBottom>
                Logo Preview
              </Typography>
              <Avatar
                src={invoiceInfo.logo_url}
                alt="Logo Preview"
                sx={{ width: 70, height: 70 }}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Grid container justifyContent="flex-end">
        <Grid item>
          {isEditable ? (
            <>
              <Button
                variant="contained"
                onClick={handleSave}
                sx={{
                  backgroundColor: "#1976d2",
                  px: 4,
                  color: "#fff",
                  mb: 2,
                  p: 1.5,
                }}
              >
                Save Configuration
              </Button>
              <Button
                variant="outlined"
                onClick={handleCancel}
                sx={{
                  px: 4,
                  color: "#1976d2",
                  mb: 2,
                  ml: 2,
                  p: 1.5,
                }}
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button
              variant="contained"
              onClick={() => setIsEditable(true)}
              sx={{
                backgroundColor: "#1976d2",
                px: 4,
                color: "#fff",
                mb: 2,
                p: 1.5,
              }}
            >
              Edit Configuration
            </Button>
          )}
        </Grid>
      </Grid>

      {/* Backdrop with spinner */}
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

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnHover theme={theme.palette.mode} />
    </Container>
  );
};

export default InvoiceConfiguration;
