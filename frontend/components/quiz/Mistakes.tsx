"use client";

import {
  Box,
  Card,
  CardContent,
  Chip,
  FormControl,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  Switch,
  Typography,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "@/redux/store";
import { loadMistakes, setIsByPercentage, setTopicId } from "@/redux/mistakesSlice";
import { useEffect } from "react";

const selectSx = {
  color: "#f1f5f9",
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(148, 163, 184, 0.2)",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(16, 185, 129, 0.4)",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#10b981",
  },
  "& .MuiSvgIcon-root": { color: "#64748b" },
};

const menuPropsSx = {
  PaperProps: {
    sx: {
      backgroundColor: "#1e293b",
      border: "1px solid rgba(148,163,184,0.15)",
      "& .MuiMenuItem-root": {
        color: "#e2e8f0",
        fontSize: "0.85rem",
        "&:hover": { backgroundColor: "rgba(16,185,129,0.08)" },
        "&.Mui-selected": {
          backgroundColor: "rgba(16,185,129,0.12)",
          "&:hover": { backgroundColor: "rgba(16,185,129,0.15)" },
        },
      },
    },
  },
};

export default function Mistakes() {
  const { topics } = useSelector((state: RootState) => state.appState);
  const { mistakes, topicId, isByPercentage, isLoading } = useSelector(
    (state: RootState) => state.mistakesState
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadMistakes({ topicId: topicId, byTotal: !isByPercentage, topCount: 5 }));
  }, [dispatch, topicId, isByPercentage]);

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ color: "#f1f5f9", fontWeight: 800, mb: 0.5 }}>
          Most Missed Questions
        </Typography>
      </Box>

      <Card
        sx={{
          backgroundColor: "#1e293b",
          border: "1px solid rgba(148, 163, 184, 0.1)",
          mb: 3,
        }}
      >
        <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "#64748b" }}>
              <FilterListIcon sx={{ fontSize: 18 }} />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Filters
              </Typography>
            </Box>

            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel sx={{ color: "#64748b" }}>Topic</InputLabel>
              <Select
                value={topicId}
                label="Topic"
                onChange={(e) => dispatch(setTopicId(Number(e.target.value)))}
                sx={selectSx}
                MenuProps={menuPropsSx}
              >
                <MenuItem value={0}>All Topics</MenuItem>
                {topics.map((topic) => (
                  <MenuItem key={topic.id} value={topic.id}>
                    {topic.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: 1.5,
                py: 0.5,
                borderRadius: 2,
                border: "1px solid rgba(148, 163, 184, 0.2)",
                backgroundColor: "rgba(15, 23, 42, 0.4)",
              }}
            >
              <Typography
                variant="caption"
                sx={{ color: isByPercentage ? "#64748b" : "#10b981", fontWeight: 700 }}
              >
                Total
              </Typography>
              <Switch
                size="small"
                checked={isByPercentage}
                onChange={(_, checked) => dispatch(setIsByPercentage(checked))}
                sx={{
                  "& .MuiSwitch-switchBase": {
                    color: "#10b981",
                  },
                  "& .MuiSwitch-switchBase.Mui-checked": { color: "#10b981" },
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                    backgroundColor: "#10b981",
                  },
                }}
              />
              <Typography
                variant="caption"
                sx={{ color: !isByPercentage ? "#64748b" : "#10b981", fontWeight: 700 }}
              >
                By %
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Card
        sx={{ backgroundColor: "#1e293b", border: "1px solid rgba(148, 163, 184, 0.1)" }}
      >
        {isLoading && (
          <LinearProgress
            sx={{
              backgroundColor: "rgba(148,163,184,0.1)",
              "& .MuiLinearProgress-bar": { backgroundColor: "#10b981" },
            }}
          />
        )}
        <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
            {mistakes.map((row) => {
              return (
                <Card
                  key={`${row.questionText}-${row.topicName}`}
                  sx={{
                    position: "relative",
                    backgroundColor: "#0f172a",
                    border: "1px solid rgba(148, 163, 184, 0.08)",
                    "&:hover": { backgroundColor: "rgba(15, 23, 42, 0.95)" },
                  }}
                >
                  <Chip
                    label={row.topicName}
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 8,
                      left: 8,
                      height: 20,
                      fontSize: "0.7rem",
                      backgroundColor: "rgba(16, 185, 129, 0.14)",
                      color: "#10b981",
                      border: "1px solid rgba(16, 185, 129, 0.28)",
                      "& .MuiChip-label": {
                        px: 0.9,
                        fontWeight: 700,
                      },
                    }}
                  />
                  <CardContent
                    sx={{
                      py: 1.75,
                      pt: 4.2,
                      px: 2,
                      "&:last-child": { pb: 1.75 },
                      display: "flex",
                      alignItems: { xs: "flex-start", md: "center" },
                      justifyContent: "space-between",
                      gap: 2,
                      flexDirection: { xs: "column", md: "row" },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 1,
                        flex: 1,
                        minWidth: 0,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ color: "#e2e8f0", lineHeight: 1.45 }}
                      >
                        {row.questionText}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.25,
                        flexWrap: "wrap",
                        justifyContent: "flex-end",
                      }}
                    >
                      <Box sx={{ minWidth: 62, textAlign: "right" }}>
                        <Typography
                          variant="caption"
                          sx={{ color: "#64748b", display: "block" }}
                        >
                          Wrong
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "#ef4444", fontWeight: 700 }}
                        >
                          {row.wrongAnswerCount}
                        </Typography>
                      </Box>

                      <Box sx={{ minWidth: 62, textAlign: "right" }}>
                        <Typography
                          variant="caption"
                          sx={{ color: "#64748b", display: "block" }}
                        >
                          Correct
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "#10b981", fontWeight: 700 }}
                        >
                          {row.correctAnswerCount}
                        </Typography>
                      </Box>

                      <Box sx={{ minWidth: 52, textAlign: "right" }}>
                        <Typography
                          variant="caption"
                          sx={{ color: "#64748b", display: "block" }}
                        >
                          Total
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "#e2e8f0", fontWeight: 600 }}
                        >
                          {row.totalCount}
                        </Typography>
                      </Box>

                      <Box sx={{ minWidth: 52, textAlign: "right" }}>
                        <Typography
                          variant="caption"
                          sx={{ color: "#64748b", display: "block" }}
                        >
                          Wrong
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "#f59e0b", fontWeight: 700 }}
                        >
                          {Math.round(row.wrongPercentage)}%
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              );
            })}
            {!isLoading && mistakes.length === 0 && (
              <Typography sx={{ color: "#94a3b8" }}>
                No mistakes found for the selected filter.
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
