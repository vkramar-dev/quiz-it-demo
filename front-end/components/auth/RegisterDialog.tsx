import { closeRegisterForm, openLoginForm, registerInUser } from "@/redux/appSlice";
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
import { ApiErrorPayload } from "@/biz/dto/ApiErrorPayload";

export default function RegisterDialog() {
  const dispatch = useAppDispatch();
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errors, setErrors] = useState<string[]>([]);
  const { isRegisterDialogOpen } = useSelector((state: RootState) => state.appState);

  useEffect(() => {
    if (isRegisterDialogOpen) {
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setErrors([]);
    }
  }, [isRegisterDialogOpen]);

  const handleSubmit = useCallback(async () => {
    const validationErrors: string[] = [];

    if (!username || !email || !password) {
      validationErrors.push("Please fill in all fields.");
      setErrors(validationErrors);
      return;
    }

    if (username && username.length < 3) {
      validationErrors.push("Username must be at least 3 characters.");
    }

    if (username && username.length > 32) {
      validationErrors.push("Username must be less than 32 characters.");
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      validationErrors.push("Invalid email format.");
    }

    if (email && email.length > 255) {
      validationErrors.push("Email must be less than 255 characters.");
    }

    let passwordIsValid = true;
    if (password && password.length < 6) {
      validationErrors.push("Password must be at least 6 characters.");
      passwordIsValid = false;
    }

    if (password && password.length > 32) {
      validationErrors.push("Password must be less than 32 characters.");
      passwordIsValid = false;
    }

    if (passwordIsValid && password !== confirmPassword) {
      if (!confirmPassword) {
        validationErrors.push("Please confirm your password.");
      } else {
        validationErrors.push("Passwords do not match.");
      }
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await dispatch(registerInUser({ username, email, password })).unwrap();
    } catch (error) {
      const err = error as ApiErrorPayload;
      const messages = Object.values(err.error ?? {}).flat();
      setErrors(messages.length > 0 ? messages : ["Registration failed."]);
    }
  }, [dispatch, username, email, password, confirmPassword]);

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
      open={isRegisterDialogOpen}
      onClose={() => dispatch(closeRegisterForm())}
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
      <DialogTitle sx={{ color: "#f1f5f9", fontWeight: 700, pb: 0 }}>
        Create Account
      </DialogTitle>

      <DialogContent>
        <Typography variant="body2" sx={{ color: "#94a3b8", mb: 2, mt: 1 }}>
          Join Quiz-IT to save your progress and compete.
        </Typography>

        <TextField
          fullWidth
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          sx={textFieldSx}
        />

        <TextField
          fullWidth
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          sx={textFieldSx}
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

        <TextField
          fullWidth
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="new-password"
          sx={{ ...textFieldSx, mb: 1 }}
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
            onClick={() => dispatch(closeRegisterForm())}
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
            Create Account
          </Button>
        </Box>

        <Typography variant="caption" sx={{ color: "#64748b", textAlign: "center" }}>
          Already have an account?
          <Box
            component="span"
            onClick={() => dispatch(openLoginForm())}
            sx={{
              color: "#10b981",
              cursor: "pointer",
              fontWeight: 600,
              "&:hover": { textDecoration: "underline" },
            }}
          >
            {" "}
            Sign In
          </Box>
        </Typography>
      </DialogActions>
    </Dialog>
  );
}
