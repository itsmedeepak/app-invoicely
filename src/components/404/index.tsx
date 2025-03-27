import React from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";

const NotFoundPage = () => {

  const navigate = useNavigate();

  return (
    <Container
      maxWidth="sm"
      sx={{
        textAlign: "center",
        py: 5,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography
        variant="h1"
        fontWeight="700"
        color="primary"
        sx={{ fontSize: "6rem" }}
      >
        404
      </Typography>
      <Typography variant="h4" fontWeight="300" sx={{ mb: 2 }}>
        Oops! Page Not Found
      </Typography>
      <Typography
        variant="body1"
        color="textSecondary"
        fontWeight="300"
        sx={{ mb: 3 }}
      >
        The page you are looking for doesn't exist or has been moved.
      </Typography>

      {/* Animated SVG Illustration */}
      <Box
        component="img"
        src={
          "https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif"
        }
        // alt="404 illustration"
        sx={{
          width: "80%",
          maxWidth: 400,
          mb: 3,
          borderRadius: 2,
        }}
      />

      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/")}
        sx={{ py: 1.5, fontSize: "1rem", borderRadius: 2, fontWeight: "300" }}
        startIcon={<SentimentDissatisfiedIcon />}
      >
        Go Home
      </Button>
    </Container>
  );
};

export default NotFoundPage;
