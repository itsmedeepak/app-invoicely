import {
  Box,
  Button,
  Card,
  Divider,
  TextField,
  Typography,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ReceiptIcon from "@mui/icons-material/Receipt";
import { API_URL } from "../../utils/config";
import { toast } from "react-toastify";
import axios from "axios";
import { useTheme } from "@mui/material/styles";

interface User {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}
const isValidEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const isValidPassword = (password: string) => {
  // Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&^])[A-Za-z\d@$!%*?#&^]{8,}$/;
  return regex.test(password);
};

const isValidPhone = (phone: string) => {
  const regex = /^\d{10}$/; // Adjust for your region
  return regex.test(phone);
};

const SignUp: React.FC = () => {
  const [user, setUser] = useState<User>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  const handleSignUp = async () => {
    // Validate fields
    if (!user.firstName || !user.lastName || !user.email || !user.phone || !user.password) {
      toast.error("All fields are required.");
      return;
    }
  
    if (!isValidEmail(user.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
  
    if (!isValidPhone(user.phone)) {
      toast.error("Please enter a valid 10-digit phone number.");
      return;
    }
  
    if (!isValidPassword(user.password)) {
      toast.error(
        "Password must be at least 8 characters, include uppercase, lowercase, number, and special character."
      );
      return;
    }
  
    try {
      setLoading(true);
      const payload = {
        first_name: user.firstName,
        last_name: user.lastName,
        email: user.email.toLowerCase(),
        phone: user.phone,
        password: user.password,
      };
  
      const response = await axios.post(`${API_URL}/auth/sign-up`, payload);
  
      if (response.status === 200 || response.status === 201) {
        toast.success("Signup successful! 🎉 Trial subscription activated.");
        // Optional: Redirect to login or dashboard
        setTimeout(() => navigate("/auth/sign-in"), 2000);
      } else {
        toast.error(response.data.message || "Signup failed!");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Signup failed!");
      } else {
        toast.error("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };
  


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  return (
    <>
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Card variant="outlined" sx={{ width: 420, mx: "auto", my: 4 }}>
          <Box sx={{ p: 2, textAlign: "center" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
              }}
            >
              <ReceiptIcon fontSize="large" color="primary" />
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Invoicely
              </Typography>
            </Box>
            <Typography variant="h5" sx={{ mt: 4 }}>
              Sign Up
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Please enter your details to sign up.
            </Typography>
          </Box>
          <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="First Name"
                name="firstName"
                value={user.firstName}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                required
              />
              <TextField
                label="Last Name"
                name="lastName"
                value={user.lastName}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                required
              />
            </Box>

            <TextField
              label="Email"
              name="email"
              value={user.email}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              required
            />

            <TextField
              label="Phone"
              name="phone"
              value={user.phone}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              required
            />

            <TextField
              label="Password"
              type="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              required
            />

            <Button
              variant="contained"
              sx={{ p: 1.5 }}
              fullWidth
              onClick={handleSignUp}
            >
              Sign Up
            </Button>

            <Divider />

            <Typography textAlign="center" variant="body2" sx={{ mt: 2 }}>
              Already have an account?{" "}
              <Link
                to="/auth/sign-in"
                style={{ textDecoration: "none", color: "#1976d2" }}
              >
                Sign in
              </Link>
            </Typography>
          </Box>
        </Card>
      </Box>

      {/* Fullscreen Loader */}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress
          style={{
            color:
              theme.palette.mode === "dark"
                ? "#90caf9" // light blue for dark mode
                : "#1976d2", // primary blue for light mode
          }}
        />
      </Backdrop>
    </>
  );
};

export default SignUp;
