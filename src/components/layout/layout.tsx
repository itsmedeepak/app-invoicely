import * as React from "react";
import { Navigate, Outlet } from "react-router";
import { Container, CssBaseline } from "@mui/material";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import Profile from "../auth/profile";
import { Session } from "../../utils/types";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { isTokenExpired } from "../../utils/auth";

export default function Layout() {
  const authToken = useSelector((state: RootState) => state.auth.refreshToken);
  const user = useSelector((state: RootState) => state.auth.user); // From Redux

  if (!authToken || isTokenExpired(authToken)) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  const session: Session | null = user
    ? {
        user: {
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          image: "https://avatars.githubusercontent.com/u/19550456", // fallback avatar
        },
      }
    : null;

  return (
    <>
      <CssBaseline />
      <DashboardLayout
        slots={{
          toolbarAccount: () =>
            session ? <Profile session={session} /> : null,
        }}
      >
        <Container sx={{ my: 2 }}>
          <Outlet />
        </Container>
      </DashboardLayout>
    </>
  );
}
