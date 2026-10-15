"use client";

import { Box, Typography, Container } from "@mui/material";
import Navbar from "@/components/quiz/Navbar";
import LoginDialog from "../auth/LoginDialog";
import RegisterDialog from "../auth/RegisterDialog";
import { ReactNode, useEffect } from "react";
import React from "react";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [initialized, setInitialized] = React.useState(false);

  useEffect(() => {
    setInitialized(true);
  }, []);
    
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar isInitialized={initialized} />

      <Container maxWidth="lg" sx={{ flex: 1, py: 4 }}>
        {children}
      </Container>

      {/* Footer */}
      <Box
        sx={{
          textAlign: "center",
          py: 3,
          borderTop: "1px solid rgba(148, 163, 184, 0.06)",
        }}
      >
        <Typography variant="caption" sx={{ color: "#475569" }}>
          Quiz-IT - Built for learning
        </Typography>
      </Box>

      {/* Auth Dialogs */}
      <LoginDialog />
      <RegisterDialog />
    </Box>
  );
}
