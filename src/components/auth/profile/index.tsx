import {
  Box,
  Tooltip,
  IconButton,
  Avatar,
  Menu,
  Typography,
  Divider,
  MenuItem,
  ListItemIcon,
  useTheme,
} from "@mui/material";
import React from "react";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";

import { useNavigate } from "react-router-dom";
import { Session } from "../../../utils/types";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store/store";
import { logout } from "../../../hooks/authSlice"; // <-- Import signOut action
import { toast } from "react-toastify"; // Optional: for toast
import HelpOutlineIcon from '@mui/icons-material/HelpCenter';
const Profile: React.FC<{ session: Session | null }> = ({ session }) => {
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    dispatch(logout()); // Clear Redux auth state
    sessionStorage.clear(); // Optional: clear sessionStorage/localStorage
    toast.success("Logged out successfully!");
    navigate("/auth/sign-in"); // Redirect to login page
  };

  return (
    <Box sx={{ flexGrow: 0, px: 1.5 }}>
      <Tooltip title="Account settings">
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <Avatar sx={{ backgroundColor: theme.palette.primary.main }}>
            {user?.firstName?.[0]}
          </Avatar>
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorElUser}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
        onClick={handleCloseUserMenu}
        PaperProps={{
          elevation: 4,
          sx: {
            mt: 1.5,
            overflow: "visible",
            filter: "drop-shadow(0px 4px 10px rgba(0,0,0,0.1))",
            borderRadius: 1,
            minWidth: 240,
            padding: 1,
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Box sx={{ p: 1 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            {session?.user?.name ?? "User Name"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {session?.user?.email ?? "user@example.com"}
          </Typography>
        </Box>

        <Divider sx={{ my: 1 }} />

        <MenuItem onClick={() => navigate("/profile")}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>

        <MenuItem onClick={() => navigate("/subscriptions")}>
          <ListItemIcon>
            <SubscriptionsIcon fontSize="small" />
          </ListItemIcon>
          Subscriptions
        </MenuItem>

        {/* <MenuItem onClick={() => navigate("/billing")}>
          <ListItemIcon>
            <PaymentIcon fontSize="small" />
          </ListItemIcon>
          Billing
        </MenuItem> */}

        <MenuItem onClick={() => navigate("/configuration")}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          Configuration
        </MenuItem>

        <Divider sx={{ my: 1 }} />

        {/* <MenuItem onClick={() => navigate("/admin")}>
          <ListItemIcon>
            <AdminPanelSettingsIcon fontSize="small" />
          </ListItemIcon>
          Admin Settings
        </MenuItem> */}

        <Divider sx={{ my: 1 }} />

        

        <MenuItem onClick={() => navigate("/help-center")}>
    <ListItemIcon>
      <HelpOutlineIcon fontSize="small" />
    </ListItemIcon>
    Help Center
  </MenuItem>

  <Divider sx={{ my: 1 }} />

  <MenuItem onClick={handleLogout}>
    <ListItemIcon>
      <LogoutIcon fontSize="small" />
    </ListItemIcon>
    Logout
  </MenuItem>
      </Menu>
    </Box>
  );
};

export default Profile;
