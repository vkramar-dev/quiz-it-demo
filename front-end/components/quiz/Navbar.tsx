"use client";

import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Tabs,
  Tab,
  Button,
  IconButton,
  useMediaQuery,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Tooltip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import SchoolIcon from "@mui/icons-material/School";
import QuizIcon from "@mui/icons-material/Quiz";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import PersonIcon from "@mui/icons-material/Person";
import InfoIcon from "@mui/icons-material/Info";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import LogoutIcon from "@mui/icons-material/Logout";
import LockIcon from "@mui/icons-material/Lock";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "@/redux/store";
import { NavItem } from "@/biz/models/NavItems";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import { logOut, openLoginForm, openRegisterForm } from "@/redux/appSlice";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { page: NavItem.Quiz, icon: <QuizIcon fontSize="small" /> },
  { page: NavItem.Top, icon: <LeaderboardIcon fontSize="small" /> },
  { page: NavItem.Mistakes, icon: <ThumbDownOffAltIcon fontSize="small" /> },
  { page: NavItem.Profile, icon: <PersonIcon fontSize="small" /> },
  { page: NavItem.About, icon: <InfoIcon fontSize="small" /> },
];

interface NavbarProps {
  isInitialized: boolean;
}

export default function Navbar({ isInitialized }: NavbarProps) {
  const { user, forbiddenPages } = useSelector((state: RootState) => state.appState);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const currentPage: NavItem =
    pathname === "/"
      ? NavItem.Quiz
      : pathname === "/top"
        ? NavItem.Top
        : pathname === "/mistakes"
          ? NavItem.Mistakes
          : pathname === "/profile"
            ? NavItem.Profile
            : NavItem.About;

  const navigateTo = (page: NavItem) => {
    router.push(page === NavItem.Quiz ? "/" : `/${page.toLowerCase()}`);
  };

  const handleTabChange = (_: React.SyntheticEvent, val: NavItem) => {
    navigateTo(val);
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: "rgba(15, 23, 42, 0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(148, 163, 184, 0.08)",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", px: { xs: 2, md: 3 } }}>
        {/* Left: Logo */}
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 1.5, cursor: "pointer" }}
          onClick={() => navigateTo(NavItem.Quiz)}
        >
          <SchoolIcon sx={{ color: "#10b981", fontSize: 28 }} />
          <Box>
            <Typography
              variant="h6"
              sx={{
                color: "#f1f5f9",
                fontWeight: 800,
                fontSize: "1.1rem",
                lineHeight: 1.2,
              }}
            >
              Quiz-IT
            </Typography>
            <Typography variant="caption" sx={{ color: "#64748b", fontSize: "0.65rem" }}>
              Test Your Knowledge
            </Typography>
          </Box>
        </Box>

        {/* Center: Tabs */}
        {!isMobile && (
          <Tabs
            value={currentPage}
            onChange={handleTabChange}
            sx={{
              "& .MuiTab-root": {
                color: "#64748b",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.85rem",
                minHeight: 48,
                "&.Mui-selected": { color: "#10b981" },
              },
              "& .MuiTabs-indicator": {
                backgroundColor: "#10b981",
                height: 2.5,
                borderRadius: 2,
              },
            }}
          >
            {navItems.map((item) => {
              const isDisabled = forbiddenPages.includes(item.page);
              return (
                <Tab
                  key={item.page}
                  value={item.page}
                  disabled={isDisabled}
                  label={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      {item.page}
                      {isDisabled && isInitialized && (
                        <LockIcon sx={{ fontSize: 12, color: "#475569" }} />
                      )}
                    </Box>
                  }
                  icon={item.icon}
                  iconPosition="start"
                  sx={{
                    opacity: isDisabled ? 0.4 : 1,
                    cursor: isDisabled ? "not-allowed" : "pointer",
                  }}
                />
              );
            })}
          </Tabs>
        )}

        {/* Right: Auth Buttons */}
        {!isMobile && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              minWidth: 180,
              justifyContent: "flex-end",
            }}
          >
            {!isInitialized ? null : user ? (
              <>
                <Tooltip title={user.email}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <PersonIcon sx={{ color: "#10b981", fontSize: 20 }} />
                    <Typography
                      variant="body2"
                      sx={{ color: "#e2e8f0", fontWeight: 600, fontSize: "0.85rem" }}
                    >
                      {user.login}
                    </Typography>
                  </Box>
                </Tooltip>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<LogoutIcon sx={{ fontSize: 16 }} />}
                  onClick={() => {
                    dispatch(logOut());
                    navigateTo(NavItem.Quiz);
                  }}
                  sx={{
                    borderColor: "rgba(148, 163, 184, 0.2)",
                    color: "#94a3b8",
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "0.8rem",
                    borderRadius: 2,
                    "&:hover": {
                      borderColor: "rgba(148, 163, 184, 0.4)",
                      backgroundColor: "rgba(148, 163, 184, 0.05)",
                    },
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<LoginIcon sx={{ fontSize: 16 }} />}
                  //onClick={onOpenLogin}
                  onClick={() => dispatch(openLoginForm())}
                  sx={{
                    borderColor: "rgba(16, 185, 129, 0.4)",
                    color: "#10b981",
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "0.8rem",
                    borderRadius: 2,
                    "&:hover": {
                      borderColor: "#10b981",
                      backgroundColor: "rgba(16, 185, 129, 0.08)",
                    },
                  }}
                >
                  Login
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<PersonAddIcon sx={{ fontSize: 16 }} />}
                  //onClick={onOpenRegister}
                  onClick={() => dispatch(openRegisterForm())}
                  sx={{
                    backgroundColor: "#10b981",
                    color: "#0f172a",
                    textTransform: "none",
                    fontWeight: 700,
                    fontSize: "0.8rem",
                    borderRadius: 2,
                    boxShadow: "none",
                    "&:hover": {
                      backgroundColor: "#059669",
                      boxShadow: "none",
                    },
                  }}
                >
                  Register
                </Button>
              </>
            )}
          </Box>
        )}

        {/* Mobile: Hamburger */}
        {isMobile && (
          <IconButton
            onClick={() => setDrawerOpen(true)}
            sx={{ color: "#94a3b8" }}
            aria-label="Open navigation menu"
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Mobile Drawer */}
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          PaperProps={{
            sx: {
              backgroundColor: "#1e293b",
              borderLeft: "1px solid rgba(148, 163, 184, 0.1)",
              width: 280,
            },
          }}
        >
          <Box sx={{ p: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6" sx={{ color: "#f1f5f9", fontWeight: 700 }}>
                Quiz-IT
              </Typography>
              <IconButton
                onClick={() => setDrawerOpen(false)}
                sx={{ color: "#94a3b8" }}
                aria-label="Close navigation menu"
              >
                <CloseIcon />
              </IconButton>
            </Box>
            <Divider sx={{ borderColor: "rgba(148, 163, 184, 0.1)", mb: 1 }} />
            <List>
              {navItems.map((item) => {
                const isDisabled = forbiddenPages.includes(item.page);
                return (
                  <Box key={item.page}>
                    <ListItemButton
                      selected={currentPage === item.page}
                      onClick={() => {
                        navigateTo(item.page);
                        setDrawerOpen(false);
                      }}
                      disabled={isDisabled}
                      sx={{
                        mx: 1,
                        borderRadius: 2,
                        mb: 0.5,
                        opacity: isDisabled ? 0.4 : 1,
                        cursor: isDisabled ? "not-allowed" : "pointer",
                        "&.Mui-selected": {
                          backgroundColor: "rgba(16, 185, 129, 0.1)",
                          "&:hover": {
                            backgroundColor: "rgba(16, 185, 129, 0.15)",
                          },
                        },
                        "&:hover": {
                          backgroundColor: "rgba(148, 163, 184, 0.08)",
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 36,
                          color: currentPage === item.page ? "#10b981" : "#64748b",
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            {item.page}
                            {isDisabled && isInitialized && (
                              <LockIcon sx={{ fontSize: 12, color: "#475569" }} />
                            )}
                          </Box>
                        }
                        primaryTypographyProps={{
                          fontWeight: currentPage === item.page ? 700 : 500,
                          color: currentPage === item.page ? "#f1f5f9" : "#94a3b8",
                          fontSize: "0.95rem",
                        }}
                      />
                    </ListItemButton>
                  </Box>
                );
              })}
            </List>
            <Divider sx={{ borderColor: "rgba(148, 163, 184, 0.1)", my: 1 }} />
            <Box sx={{ px: 2, pt: 1 }}>
              {!isInitialized ? null : user ? (
                <>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                    <PersonIcon sx={{ color: "#10b981", fontSize: 20 }} />
                    <Typography
                      variant="body2"
                      sx={{ color: "#e2e8f0", fontWeight: 600 }}
                    >
                      {user.login}
                    </Typography>
                  </Box>
                  <Button
                    fullWidth
                    variant="outlined"
                    size="small"
                    startIcon={<LogoutIcon sx={{ fontSize: 16 }} />}
                    onClick={() => {
                      dispatch(logOut());
                      navigateTo(NavItem.Quiz);
                      setDrawerOpen(false);
                    }}
                    sx={{
                      borderColor: "rgba(148, 163, 184, 0.2)",
                      color: "#94a3b8",
                      textTransform: "none",
                      fontWeight: 600,
                      borderRadius: 2,
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    fullWidth
                    variant="outlined"
                    size="small"
                    startIcon={<LoginIcon sx={{ fontSize: 16 }} />}
                    onClick={() => {
                      dispatch(openLoginForm());
                      setDrawerOpen(false);
                    }}
                    sx={{
                      mb: 1,
                      borderColor: "rgba(16, 185, 129, 0.4)",
                      color: "#10b981",
                      textTransform: "none",
                      fontWeight: 600,
                      borderRadius: 2,
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    fullWidth
                    variant="contained"
                    size="small"
                    startIcon={<PersonAddIcon sx={{ fontSize: 16 }} />}
                    onClick={() => {
                      dispatch(openRegisterForm());
                      setDrawerOpen(false);
                    }}
                    sx={{
                      backgroundColor: "#10b981",
                      color: "#0f172a",
                      textTransform: "none",
                      fontWeight: 700,
                      borderRadius: 2,
                      boxShadow: "none",
                      "&:hover": {
                        backgroundColor: "#059669",
                      },
                    }}
                  >
                    Register
                  </Button>
                </>
              )}
            </Box>
          </Box>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
}
