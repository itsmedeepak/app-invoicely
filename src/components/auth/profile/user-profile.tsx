import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Avatar,
  Grid,
  Divider,
  Tabs,
  Tab,
  useTheme,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import axios from "axios";
import { API_URL } from "../../../utils/config";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const validatePasswordStrength = (password: string) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^])[A-Za-z\d@$!%*?&#^]{8,}$/;
  return regex.test(password);
};



const UserProfile: React.FC = () => {
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
  });

  const userInfo = useSelector((state: RootState) => state.auth);
  const theme = useTheme();
  const authToken = userInfo.refreshToken;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/profile`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        const data = response.data.data;
        setProfileData({
          firstName: data.first_name || "",
          lastName: data.last_name || "",
          email: data.email || "",
          phone: data.phone || "",
          address: "", // Assuming address isn't returned
        });
        // toast.success("Profile fetched successfully");
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [authToken]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await axios.put(`${API_URL}/profile`, profileData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setEditMode(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    // Optionally refetch profile or restore original data
  };


  // Add these states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // Change Password Handler
  const handlePasswordChange = async () => {

    
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    if (!validatePasswordStrength(newPassword)) {
      toast.error(
        "Password must be at least 8 characters, include uppercase, lowercase, number, and special character."
      );
      return;
    }
  

    try {
      setLoading(true)
      setUpdatingPassword(true);
      const response = await axios.put(`${API_URL}/change-password`, {
        current_password: currentPassword,
        new_password: newPassword,
      }, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      setLoading(false)
      toast.success(response.data.message || "Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update password.");
    } finally {
      setUpdatingPassword(false);
    }
  };

  const handlePasswordCancel = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };


  return (
    <Box sx={{ p: 3, minHeight: "100vh" }}>
      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      {/* Fullscreen Loader */}
      <Backdrop open={loading} sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Card sx={{ maxWidth: 900, mx: "auto", p: 3 }}>
        {/* Profile Header */}
        <Box display="flex" alignItems="center" mb={3}>
          <Avatar sx={{ backgroundColor: theme.palette.primary.main, width: 60, height: 60, mr: 3 }}>
            {profileData.firstName?.[0]?.toUpperCase() || "U"}
          </Avatar>
          <Box>
            <Typography variant="h5">
              {profileData.firstName} {profileData.lastName}
            </Typography>
            <Typography variant="body2">{profileData.email}</Typography>
          </Box>
        </Box>

        {/* Tabs */}
        <Tabs value={tab} onChange={handleTabChange} sx={{ mb: 3 }}>
          <Tab label="Edit Profile" />
          <Tab label="Change Password" />
        </Tabs>

        <Divider sx={{ mb: 3 }} />

        {/* Tab Panels */}
        {tab === 0 && (
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Personal Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={profileData.firstName}
                  onChange={handleInputChange}
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={profileData.lastName}
                  onChange={handleInputChange}
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  disabled
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleInputChange}
                  disabled={!editMode}
                />
              </Grid>

            </Grid>

            <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
              {editMode ? (
                <>
                  <Button variant="contained" color="primary" onClick={handleSave}>
                    Save Changes
                  </Button>
                  <Button variant="outlined" color="secondary" onClick={handleCancel}>
                    Cancel
                  </Button>
                </>
              ) : (
                <Button variant="contained" color="primary" onClick={handleEditClick}>
                  Edit
                </Button>
              )}
            </Box>
          </CardContent>
        )}

        {tab === 1 && (
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Change Password
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Current Password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="New Password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Confirm New Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handlePasswordChange}
                disabled={updatingPassword}
              >
                {updatingPassword ? "Updating..." : "Update Password"}
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handlePasswordCancel}
                disabled={updatingPassword}
              >
                Cancel
              </Button>
            </Box>
          </CardContent>
        )}

      </Card>
    </Box>
  );
};

export default UserProfile;
