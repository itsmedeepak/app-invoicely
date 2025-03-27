import {
  Box,
  Card,
  Divider,
  TextField,
  Typography,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ReceiptIcon from "@mui/icons-material/Receipt";
import { API_URL } from "../../utils/config";
import { toast } from "react-toastify";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../../hooks/authSlice";
import { RootState } from "../../store/store";
import { useTheme } from "@mui/material/styles";

interface UserCredentials {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const [user, setUser] = useState<UserCredentials>({
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector((state: RootState) => state.auth.loading);
  const theme = useTheme();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleSignIn = async () => {
    dispatch(signInStart());
    try {
      const payload = {
        email: user.email.toLowerCase(),
        password: user.password,
      };

      const response = await axios.post(`${API_URL}/auth/sign-in`, payload);

      if (response.status === 200 || response.status === 201) {
        const data = response.data.data;

        const userInfo = {
          userId: data._id,
          email: data.email,
          firstName: data.first_name,
          lastName: data.last_name,
          walkThrough:data.walk_through
        };

        console.log(data)

        dispatch(
          signInSuccess({
            user: userInfo,
            authToken: data.auth_token,
            refreshToken: data.refresh_token,
          })
        );

        toast.success("Login successful!");
        navigate("/");
      } else {
        dispatch(signInFailure(response.data.message || "Login failed!"));
        toast.error(response.data.message || "Login failed!");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || "Login failed!";
        dispatch(signInFailure(errorMessage));
        toast.error(errorMessage);
      } else {
        dispatch(signInFailure("Network error. Please try again."));
        toast.error("Network error. Please try again.");
      }
    }
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
              Sign In
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              Welcome back! Please enter your details to continue.
            </Typography>
          </Box>

          <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
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
              label="Password"
              type="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              required
            />
            <LoadingButton
              variant="contained"
              sx={{ p: 1.5 }}
              fullWidth
              loading={loading}
              onClick={handleSignIn}
            >
              Sign In
            </LoadingButton>
            <Link to="/auth/forgot-password" style={{ textDecoration: "none" }}>
              <Typography
                textAlign="center"
                variant="body2"
                sx={{ mt: 1, color: "primary.main" }}
              >
                Forgot your password?
              </Typography>
            </Link>

            <Divider />

            <Typography textAlign="center" variant="body2" sx={{ mt: 2 }}>
              Don’t have an account?{" "}
              <Link
                to="/auth/sign-up"
                style={{ textDecoration: "none", color: "#1976d2" }}
              >
                Sign up
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
                ? "#90caf9"
                : "#1976d2",
          }}
        />
      </Backdrop>
    </>
  );
};

export default SignIn;
