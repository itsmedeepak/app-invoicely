import React, { useState, useEffect } from "react";
import { Box, Typography, Button, MobileStepper, useTheme } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import ReceiptIcon from "@mui/icons-material/Receipt";
import axios from "axios";
import { toast } from "react-toastify";
import { API_URL } from "../../utils/config";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

const steps = [
  {
    icon: <SettingsIcon fontSize="large" color="primary" />,
    title: "Configure Invoicing",
    description: "Set up your invoice settings, including your company logo, business details, and preferred payment methods.",
  },
  {
    icon: <ShoppingCartIcon fontSize="large" color="primary" />,
    title: "Add Products & Services",
    description: "Create and manage a list of products or services for quick invoice generation.",
  },
  {
    icon: <PeopleIcon fontSize="large" color="primary" />,
    title: "Add Customers",
    description: "Save customer details for easier invoice management and tracking.",
  },
  {
    icon: <ReceiptIcon fontSize="large" color="primary" />,
    title: "Create & Send Invoices",
    description: "Generate invoices, email them, and track payments in real-time.",
  },
];

const MUICarousel: React.FC = () => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = steps.length;
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null); // State to store profile data

  const userInfo = useSelector((state: RootState) => state.auth);
  const authToken = userInfo.refreshToken;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/profile`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        const data = response.data.data;
        setProfile({
          firstName: data.first_name || "",
          lastName: data.last_name || "",
          email: data.email || "",
          phone: data.phone || "",
          
          address: "", // Assuming address isn't returned
        });
        
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [authToken]);

  const handleClose = async () => {
    if (!profile) return; // Prevent updates if profile isn't loaded

    try {
      setLoading(true);

      // Update only the walk_through field
      const updatedProfile = { ...profile, walk_through: false };

      await axios.put(`${API_URL}/profile`, updatedProfile, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      toast.success("Walkthrough completed!");

    } catch (error) {
      console.error("Error updating walkthrough status:", error);
      toast.error("Failed to update walkthrough.");
    } finally {
      setLoading(false);
      setActiveStep(-1)
    }
  };

  return (
    <>
      {profile?.walk_through && activeStep >= 0 && (
        <>
          {/* Blurred Background */}
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              backdropFilter: "blur(10px)",
              zIndex: 10,
            }}
          />

          {/* Carousel Box */}
          <Box
            sx={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "90%",
              maxWidth: 500,
              height: 350,
              textAlign: "center",
              p: { xs: 2, sm: 3 },
              borderRadius: 2,
              boxShadow: 5,
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.primary,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              zIndex: 20,
            }}
          >
            {/* Step Icon & Title */}
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
              {steps[activeStep].icon}
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {steps[activeStep].title}
              </Typography>
            </Box>

            {/* Description */}
            <Typography variant="body1" sx={{ flexGrow: 1, display: "flex", alignItems: "center", justifyContent: "center", px: 2 }}>
              {steps[activeStep].description}
            </Typography>

            {/* Navigation Buttons */}
            <MobileStepper
              variant="dots"
              steps={maxSteps}
              position="static"
              activeStep={activeStep}
              nextButton={
                <Button size="small" onClick={() => setActiveStep((prev) => Math.min(prev + 1, maxSteps - 1))} disabled={activeStep === maxSteps - 1} color="primary">
                  Next
                </Button>
              }
              backButton={
                <Button size="small" onClick={() => setActiveStep((prev) => Math.max(prev - 1, 0))} disabled={activeStep === 0} color="primary">
                  Back
                </Button>
              }
              sx={{ justifyContent: "center" }}
            />

            {/* Close Button */}
            <Button variant="contained" fullWidth onClick={handleClose} sx={{ mt: 2 }} disabled={loading || !profile}>
              {loading ? "Closing..." : "Close"}
            </Button>
          </Box>
        </>
      )}
    </>
  );
};

export default MUICarousel;
