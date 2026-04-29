"use client";

import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  CircularProgress,
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import QuizIcon from "@mui/icons-material/Quiz";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import { RootState, useAppDispatch } from "@/redux/store";
import { useSelector } from "react-redux";
import { getProfile, hide } from "@/redux/profileSlice";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const getGradeColor = (pct: number) => {
  if (pct >= 80) return "#10b981";
  if (pct >= 60) return "#f59e0b";
  return "#ef4444";
};

const getGradeLabel = (pct: number) => {
  if (pct >= 90) return "A+";
  if (pct >= 80) return "A";
  if (pct >= 70) return "B";
  if (pct >= 60) return "C";
  if (pct >= 50) return "D";
  return "F";
};

export default function PersonalStatistics() {
  const user = useSelector((state: RootState) => state.appState.user);
  const { profile, isLoading, error } = useSelector(
    (state: RootState) => state.profileState
  );
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography variant="h6" sx={{ color: "#f1f5f9", mb: 1 }}>
          Could not load profile
        </Typography>
        <Typography variant="body2" sx={{ color: "#94a3b8" }}>
          Please try again later.
        </Typography>
      </Box>
    );
  }

  if (!profile) {
    return null;
  }

  const totalAttempts = profile.profileSummary.totalAttemptCount;
  const avgPercentage = profile.profileSummary.averageScore;
  const bestScore = profile.profileSummary.bestScore;
  const totalQuestions = profile.profileSummary.answerCount;
  const topicStats = profile.topics;
  const attempts = profile.attempts;

  if (totalAttempts === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <QuizIcon sx={{ fontSize: 64, color: "#334155", mb: 2 }} />
        <Typography variant="h5" sx={{ color: "#f1f5f9", mb: 1, fontWeight: 700 }}>
          No Quiz Attempts Yet
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: "#94a3b8", mb: 3, maxWidth: 400, mx: "auto" }}
        >
          Complete a quiz to start tracking your progress. Your scores, percentages, and
          history will appear here.
        </Typography>
        <Button
          variant="contained"
          onClick={() => router.push("/")}
          sx={{
            backgroundColor: "#10b981",
            color: "#fff",
            fontWeight: 700,
            "&:hover": { backgroundColor: "#059669" },
          }}
        >
          Take a Quiz
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* User Profile Card */}
      {user && (
        <Card
          sx={{
            backgroundColor: "#1e293b",
            border: "1px solid rgba(148, 163, 184, 0.1)",
            mb: 3,
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  backgroundColor: "rgba(16, 185, 129, 0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <PersonIcon sx={{ color: "#10b981", fontSize: 24 }} />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ color: "#f1f5f9", fontWeight: 700 }}>
                  {user.login}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <EmailIcon sx={{ fontSize: 14, color: "#64748b" }} />
                  <Typography variant="caption" sx={{ color: "#64748b" }}>
                    {user.email}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box sx={{ display: "flex", gap: 3 }}>
              <Box>
                <Typography variant="h6" sx={{ color: "#10b981", fontWeight: 700 }}>
                  {totalAttempts}
                </Typography>
                <Typography variant="caption" sx={{ color: "#64748b" }}>
                  Quizzes
                </Typography>
              </Box>
              <Box>
                <Typography variant="h6" sx={{ color: "#10b981", fontWeight: 700 }}>
                  {profile.profileSummary.averageScore}%
                </Typography>
                <Typography variant="caption" sx={{ color: "#64748b" }}>
                  Average
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ color: "#f1f5f9", fontWeight: 700 }}>
            Profile
          </Typography>
          <Typography variant="body2" sx={{ color: "#94a3b8" }}>
            Track your progress across all topics
          </Typography>
        </Box>
        <Button
          variant="outlined"
          size="small"
          startIcon={<DeleteOutlineIcon />}
          onClick={() => dispatch(hide())}
          sx={{
            borderColor: "rgba(239, 68, 68, 0.3)",
            color: "#ef4444",
            fontWeight: 600,
            fontSize: "0.8rem",
            "&:hover": {
              borderColor: "#ef4444",
              backgroundColor: "rgba(239, 68, 68, 0.06)",
            },
          }}
        >
          Clear History
        </Button>
      </Box>

      {/* Summary Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" },
          gap: 2,
          mb: 3,
        }}
      >
        {[
          {
            label: "Total Attempts",
            value: totalAttempts,
            icon: <QuizIcon />,
            color: "#10b981",
          },
          {
            label: "Average Score",
            value: `${avgPercentage}%`,
            icon: <TrendingUpIcon />,
            color: getGradeColor(avgPercentage),
          },
          {
            label: "Best Score",
            value: `${bestScore}%`,
            icon: <EmojiEventsIcon />,
            color: getGradeColor(bestScore),
          },
          {
            label: "Questions Answered",
            value: totalQuestions,
            icon: <AccessTimeIcon />,
            color: "#94a3b8",
          },
        ].map((stat, i) => (
          <Card
            key={i}
            sx={{
              backgroundColor: "#1e293b",
              border: "1px solid rgba(148, 163, 184, 0.1)",
            }}
          >
            <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
              <Box sx={{ color: stat.color, mb: 1 }}>{stat.icon}</Box>
              <Typography variant="caption" sx={{ color: "#64748b" }}>
                {stat.label}
              </Typography>
              <Typography variant="h5" sx={{ color: "#f1f5f9", fontWeight: 700 }}>
                {stat.value}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Per-Topic Performance */}
      <Typography variant="h6" sx={{ color: "#f1f5f9", mb: 2, fontWeight: 700 }}>
        Performance by Topic
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 3 }}>
        {topicStats.map((t) => (
          <Card
            key={t.topic}
            sx={{
              backgroundColor: "#1e293b",
              border: `1px solid ${t.attemptCount > 0 ? `${t.color}20` : "rgba(148,163,184,0.06)"}`,
              opacity: t.attemptCount === 0 ? 0.5 : 1,
            }}
          >
            <CardContent sx={{ py: 2, px: 2.5, "&:last-child": { pb: 2 } }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Typography variant="body1" sx={{ color: "#f1f5f9", fontWeight: 600 }}>
                  {t.topic}
                </Typography>
                {t.attemptCount > 0 && (
                  <Chip
                    label={`${t.attemptCount} attempt${t.attemptCount > 1 ? "s" : ""}`}
                    size="small"
                    sx={{
                      backgroundColor: `${t.color}15`,
                      color: t.color,
                      fontSize: "0.7rem",
                    }}
                  />
                )}
              </Box>
              {t.attemptCount > 0 ? (
                <Box sx={{ display: "flex", gap: 3 }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: "#64748b" }}>
                      Best
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: getGradeColor(t.best), fontWeight: 700 }}
                    >
                      {t.best}%
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: "#64748b" }}>
                      Average
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: getGradeColor(t.average), fontWeight: 700 }}
                    >
                      {t.average}%
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <Typography variant="caption" sx={{ color: "#475569" }}>
                  Not attempted yet
                </Typography>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Recent History */}
      <Typography variant="h6" sx={{ color: "#f1f5f9", mb: 2, fontWeight: 700 }}>
        Recent Attempts
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {attempts.map((attempt, index) => (
          <Card
            key={index}
            sx={{
              backgroundColor: "#1e293b",
              border: "1px solid rgba(148, 163, 184, 0.06)",
            }}
          >
            <CardContent
              sx={{
                py: 1.5,
                px: 2.5,
                "&:last-child": { pb: 1.5 },
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  backgroundColor: `${getGradeColor(attempt.score)}15`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ color: getGradeColor(attempt.score), fontWeight: 800 }}
                >
                  {getGradeLabel(attempt.score)}
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ color: "#e2e8f0", fontWeight: 600 }}>
                  {attempt.topic}
                </Typography>
                <Typography variant="caption" sx={{ color: "#64748b" }}>
                  {attempt.date}
                </Typography>
              </Box>
              <Box sx={{ textAlign: "right" }}>
                <Typography variant="body2" sx={{ color: "#e2e8f0", fontWeight: 600 }}>
                  {attempt.answeredCount}/{attempt.questionCount}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: getGradeColor(attempt.score), fontWeight: 700 }}
                >
                  {attempt.score}%
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
