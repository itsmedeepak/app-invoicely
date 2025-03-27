import React from "react";
import { Container, Typography } from "@mui/material";


const ComingSoonPage = () => {

  return (
    <Container
      maxWidth="sm"
      sx={{
        textAlign: "center",
        py: 5,
        height: "80vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography variant="h3" fontWeight="300" color="primary" gutterBottom>
        🚀 Coming Soon!
      </Typography>
      <Typography variant="body1" color="textSecondary" fontWeight="300" sx={{ mb: 3 }}>
        We're working on something amazing. Stay tuned!
      </Typography>

      
    </Container>
  );
};

export default ComingSoonPage;
