"use client";

import { useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  TablePagination,
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "@/redux/store";
import {
  getPage,
  setPageNumber,
  setPageSize,
  setScore,
  setTopic,
} from "@/redux/topStatisticsSlice";

const getRankColor = (rank: number) => {
  if (rank === 1) return "#fbbf24";
  if (rank === 2) return "#94a3b8";
  if (rank === 3) return "#cd7f32";
  return "#64748b";
};

const getRankIcon = (rank: number) => {
  if (rank <= 3) {
    return <EmojiEventsIcon sx={{ fontSize: 18, color: getRankColor(rank) }} />;
  }
  return null;
};

const getGradeColor = (pct: number) => {
  if (pct >= 80) return "#10b981";
  if (pct >= 60) return "#f59e0b";
  return "#ef4444";
};

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

const headerCellSx = {
  color: "#64748b",
  fontWeight: 700,
  borderColor: "rgba(148,163,184,0.08)",
  fontSize: "0.8rem",
};

export default function Leaderboard() {
  const dispatch = useAppDispatch();

  const { rows, topicId, scoreThreshold, pageSize, pageNumber, totalCount } = useSelector(
    (state: RootState) => state.statState
  );
  const { topics } = useSelector((state: RootState) => state.appState);

  useEffect(() => {
    dispatch(getPage());
  }, [dispatch, topicId, scoreThreshold, pageSize, pageNumber]);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ color: "#f1f5f9", fontWeight: 800, mb: 0.5 }}>
          Leaderboard
        </Typography>
        <Typography variant="body1" sx={{ color: "#94a3b8" }}>
          Top quiz results from the community
        </Typography>
      </Box>

      {/* Filters */}
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
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel sx={{ color: "#64748b" }}>Topic</InputLabel>
              <Select
                value={topicId}
                label="Topic"
                onChange={(e) => dispatch(setTopic(Number(e.target.value)))}
                sx={selectSx}
                MenuProps={menuPropsSx}
              >
                <MenuItem value={0}>All Topics</MenuItem>
                {topics.map((t) => (
                  <MenuItem key={t.id} value={t.id}>
                    {t.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 130 }}>
              <InputLabel sx={{ color: "#64748b" }}>Score</InputLabel>
              <Select
                value={scoreThreshold}
                label="Score"
                onChange={(e) => dispatch(setScore(Number(e.target.value)))}
                sx={selectSx}
                MenuProps={menuPropsSx}
              >
                <MenuItem value={0}>All Scores</MenuItem>
                <MenuItem value={90}>90%+</MenuItem>
                <MenuItem value={80}>80%+</MenuItem>
                <MenuItem value={70}>70%+</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      {/* Leaderboard Table */}
      <Card
        sx={{ backgroundColor: "#1e293b", border: "1px solid rgba(148, 163, 184, 0.1)" }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={headerCellSx}>Rank</TableCell>
                <TableCell sx={headerCellSx}>User</TableCell>
                <TableCell sx={headerCellSx}>Topic</TableCell>
                <TableCell sx={headerCellSx}>Score</TableCell>
                <TableCell sx={headerCellSx}>Percentage</TableCell>
                <TableCell sx={headerCellSx}>Weighted</TableCell>
                <TableCell sx={headerCellSx}>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((entry) => {
                const isUser = entry.name === "You";
                return (
                  <TableRow
                    key={entry.rank}
                    sx={{
                      backgroundColor: isUser
                        ? "rgba(16, 185, 129, 0.05)"
                        : "transparent",
                      "&:hover": { backgroundColor: "rgba(148, 163, 184, 0.04)" },
                    }}
                  >
                    <TableCell sx={{ borderColor: "rgba(148,163,184,0.06)", py: 1.5 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        {getRankIcon(entry.rank)}
                        <Typography
                          variant="body2"
                          sx={{ color: getRankColor(entry.rank), fontWeight: 700 }}
                        >
                          #{entry.rank}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ borderColor: "rgba(148,163,184,0.06)", py: 1.5 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Avatar
                          sx={{
                            width: 28,
                            height: 28,
                            fontSize: "0.75rem",
                            backgroundColor: isUser
                              ? "rgba(16,185,129,0.2)"
                              : "rgba(148,163,184,0.1)",
                            color: isUser ? "#10b981" : "#94a3b8",
                          }}
                        >
                          {entry.name[0]}
                        </Avatar>
                        <Typography
                          variant="body2"
                          sx={{
                            color: isUser ? "#10b981" : "#e2e8f0",
                            fontWeight: isUser ? 700 : 500,
                          }}
                        >
                          {entry.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ borderColor: "rgba(148,163,184,0.06)", py: 1.5 }}>
                      <Chip
                        label={entry.topicTitle}
                        size="small"
                        sx={{
                          backgroundColor: `${entry.topicColor}15`,
                          color: entry.topicColor,
                          fontSize: "0.7rem",
                          height: 22,
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ borderColor: "rgba(148,163,184,0.06)", py: 1.5 }}>
                      <Typography variant="body2" sx={{ color: "#e2e8f0" }}>
                        {entry.answeredCount}/{entry.questionCount}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ borderColor: "rgba(148,163,184,0.06)", py: 1.5 }}>
                      <Typography
                        variant="body2"
                        sx={{ color: getGradeColor(entry.score), fontWeight: 700 }}
                      >
                        {entry.score}%
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ borderColor: "rgba(148,163,184,0.06)", py: 1.5 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: getGradeColor(entry.weightedScore),
                          fontWeight: 600,
                        }}
                      >
                        {entry.weightedScore}%
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ borderColor: "rgba(148,163,184,0.06)", py: 1.5 }}>
                      <Typography variant="caption" sx={{ color: "#64748b" }}>
                        {entry.date}
                      </Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    sx={{
                      textAlign: "center",
                      py: 4,
                      borderColor: "rgba(148,163,184,0.06)",
                    }}
                  >
                    <Typography variant="body2" sx={{ color: "#64748b" }}>
                      No results match the selected filters.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={totalCount}
            rowsPerPage={pageSize}
            page={pageNumber - 1}
            onPageChange={(_, newPage) => dispatch(setPageNumber(newPage + 1))}
            onRowsPerPageChange={(event) => {
              dispatch(setPageSize(Number(event.target.value)));
            }}
            sx={{
              backgroundColor: "#1e293b",
              borderTop: "1px solid rgba(148,163,184,0.06)",
              "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
                color: "#64748b",
                fontSize: "0.85rem",
              },
              "& .MuiSelect-root": {
                color: "#e2e8f0",
              },
              "& .MuiIconButton-root": {
                color: "#64748b",
              },
              "& .MuiIconButton-root:hover": {
                backgroundColor: "rgba(16, 185, 129, 0.1)",
              },
              "& .Mui-disabled": {
                color: "rgba(148, 163, 184, 0.3)",
              },
            }}
          />
        </TableContainer>
      </Card>
    </Box>
  );
}
