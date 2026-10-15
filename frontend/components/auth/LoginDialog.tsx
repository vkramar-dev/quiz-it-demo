import { closeLoginForm, openRegisterForm, signInUser } from "@/redux/appSlice";
import { RootState, useAppDispatch } from "@/redux/store";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { textFieldSx } from "./textFieldSx";

export default function LoginDialog() {
  const dispatch = useAppDispatch();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<string[]>([]);
  const { isLoginDialogOpen } = useSelector((state: RootState) => state.appState);

  useEffect(() => {
    if (isLoginDialogOpen) {
      setUsername("");
      setPassword("");
      setErrors([]);
    }
  }, [isLoginDialogOpen]);

  const handleSubmit = useCallback(async () => {
    if (!username || !password) {
      setErrors(["Please fill in all fields."]);
      return;
    }

    try {
      await dispatch(signInUser({ username, password })).unwrap();
    } catch (error) {
      setErrors(["Invalid username or password."]);
    }
  }, [dispatch, username, password]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  return (
    <Dialog
      open={isLoginDialogOpen}
      onClose={() => dispatch(closeLoginForm())}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: "#1e293b",
          border: "1px solid rgba(148, 163, 184, 0.15)",
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle sx={{ color: "#f1f5f9", fontWeight: 700, pb: 0 }}>Welcome Back</DialogTitle>

      <DialogContent>
        <Typography variant="body2" sx={{ color: "#94a3b8", mb: 2, mt: 1 }}>
          Sign in to track your quiz progress and statistics.
        </Typography>

        <TextField
          fullWidth
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          sx={textFieldSx}
          inputProps={{ maxLength: 32 }}
        />

        <TextField
          fullWidth
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="new-password"
          sx={textFieldSx}
          inputProps={{ maxLength: 32 }}
        />

        {errors.length > 0 &&
          errors.map((err, idx) => (
            <Alert key={idx} severity="error" sx={{ mb: 2 }}>
              {err}
            </Alert>
          ))}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, flexDirection: "column", gap: 1 }}>
        <Box sx={{ display: "flex", gap: 1, width: "100%" }}>
          <Button
            onClick={() => dispatch(closeLoginForm())}
            sx={{
              color: "#94a3b8",
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              flex: 1,
              backgroundColor: "#10b981",
              color: "#fff",
              fontWeight: 700,
              "&:hover": { backgroundColor: "#059669" },
            }}
          >
            Sign In
          </Button>
        </Box>

        <Typography variant="caption" sx={{ color: "#64748b", textAlign: "center" }}>
          Don't have an account?
          <Box
            component="span"
            onClick={() => dispatch(openRegisterForm())}
            sx={{
              color: "#10b981",
              cursor: "pointer",
              fontWeight: 600,
              "&:hover": { textDecoration: "underline" },
            }}
          >
            {" "}
            Register
          </Box>
        </Typography>
      </DialogActions>
    </Dialog>
  );
}
