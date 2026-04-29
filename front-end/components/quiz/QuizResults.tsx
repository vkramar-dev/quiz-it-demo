"use client";

import { useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import ReplayIcon from "@mui/icons-material/Replay";
import HomeIcon from "@mui/icons-material/Home";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { TestResult } from "@/biz/models/TestResult";
import { useAppDispatch } from "@/redux/store";
import { createTest, setTestData } from "@/redux/testSlice";
import { setForbiddenPages } from "@/redux/appSlice";
import { NavItem } from "@/biz/models/NavItems";

interface QuizResultsProps {
  result: TestResult;
}

export default function QuizResults({ result }: QuizResultsProps) {
  const dispatch = useAppDispatch();

  const percentage = Math.round((result.answeredCount / result.answers.length) * 100);
  const weightedPercentage =
    result.totalPoints > 0
      ? Math.round((result.earnedPoints / result.totalPoints) * 100)
      : percentage;

  const getGrade = () => {
    if (percentage >= 90) return { letter: "A+", label: "Excellent!", color: "#10b981" };
    if (percentage >= 80) return { letter: "A", label: "Great job!", color: "#10b981" };
    if (percentage >= 70) return { letter: "B", label: "Good work!", color: "#10b981" };
    if (percentage >= 60) return { letter: "C", label: "Not bad!", color: "#f59e0b" };
    if (percentage >= 50) return { letter: "D", label: "Keep practicing.", color: "#f59e0b" };
    return { letter: "F", label: "Try again.", color: "#ef4444" };
  };

  const grade = getGrade();

  const handleRetry = useCallback(async () => {
    await dispatch(createTest(result.topicName)).unwrap();
    dispatch(setForbiddenPages([NavItem.Top, NavItem.Mistakes, NavItem.Profile, NavItem.About]));
  }, [dispatch, result]);

  const handleGoToQuiz = useCallback(() => {
    dispatch(setTestData({ test: null, result: null }));
  }, [dispatch]);

  return (
    <Box sx={{ maxWidth: 720, mx: "auto" }}>
      {/* Score Card */}
      <Card sx={{ backgroundColor: "#1e293b", border: "1px solid rgba(148, 163, 184, 0.1)", mb: 3 }}>
        <CardContent sx={{ p: 4, textAlign: "center" }}>
          {/* Trophy */}
          <Box sx={{ mb: 2 }}>
            <EmojiEventsIcon sx={{ fontSize: 56, color: grade.color }} />
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" sx={{ color: "#f1f5f9", fontWeight: 800, mb: 0.5 }}>
              Quiz Complete!
            </Typography>
            <Typography variant="body1" sx={{ color: "#94a3b8" }}>
              {grade.label}
            </Typography>
          </Box>

          {/* Grade circle */}
          <Box
            sx={{
              width: 100,
              height: 100,
              borderRadius: "50%",
              border: `4px solid ${grade.color}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 3,
            }}
          >
            <Typography variant="h3" sx={{ color: grade.color, fontWeight: 800 }}>
              {grade.letter}
            </Typography>
          </Box>

          {/* Stats row */}
          <Box sx={{ display: "flex", justifyContent: "center", gap: 4, mb: 3 }}>
            <Box>
              <Typography variant="caption" sx={{ color: "#64748b", display: "block" }}>
                Score
              </Typography>
              <Typography variant="h6" sx={{ color: "#f1f5f9", fontWeight: 700 }}>
                {result.answeredCount}/{result.answers.length}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: "#64748b", display: "block" }}>
                Percentage
              </Typography>
              <Typography variant="h6" sx={{ color: "#f1f5f9", fontWeight: 700 }}>
                {percentage}%
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: "#64748b", display: "block" }}>
                Weighted
              </Typography>
              <Typography variant="h6" sx={{ color: "#f1f5f9", fontWeight: 700 }}>
                {weightedPercentage}%
              </Typography>
            </Box>
          </Box>

          {/* Actions */}
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<ReplayIcon />}
              onClick={handleRetry}
              sx={{
                backgroundColor: "#10b981",
                color: "#fff",
                fontWeight: 700,
                "&:hover": { backgroundColor: "#059669" },
              }}
            >
              Retry Quiz
            </Button>
            <Button
              variant="outlined"
              startIcon={<HomeIcon />}
              onClick={handleGoToQuiz}
              sx={{
                borderColor: "rgba(148, 163, 184, 0.3)",
                color: "#94a3b8",
                fontWeight: 600,
                "&:hover": {
                  borderColor: "#94a3b8",
                  backgroundColor: "rgba(148, 163, 184, 0.08)",
                },
              }}
            >
              All Topics
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Answer Review */}
      <Typography variant="h6" sx={{ color: "#f1f5f9", mb: 2, fontWeight: 700 }}>
        Answer Review
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        {result.answers.map((q, index) => {
          const isCorrect = q.answer === q.correctAnswer;
          const accentColor = isCorrect ? "#10b981" : "#ef4444";

          return (
            <Card key={index} sx={{ backgroundColor: "#1e293b", border: `1px solid ${accentColor}20` }}>
              <CardContent sx={{ py: 2, px: 2.5, "&:last-child": { pb: 2 } }}>
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                  <Box sx={{ mt: 0.3 }}>
                    {isCorrect ? (
                      <CheckCircleIcon sx={{ color: "#10b981", fontSize: 20 }} />
                    ) : (
                      <CancelIcon sx={{ color: "#ef4444", fontSize: 20 }} />
                    )}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ color: "#e2e8f0", fontWeight: 600, mb: 0.5 }}>
                      {index + 1}. {q.questionText}
                    </Typography>
                    {!isCorrect && (
                      <>
                        <Typography variant="caption" sx={{ color: "#ef4444", display: "block" }}>
                          Your answer:{" "}
                          {q.answer !== null && q.answer !== undefined
                            ? q.answer
                            : "No answer"}
                        </Typography>
                        <Divider sx={{ my: 0.5, borderColor: "rgba(148,163,184,0.08)" }} />
                      </>
                    )}
                    <Typography variant="caption" sx={{ color: "#10b981" }}>
                      Correct: {q.correctAnswer}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      backgroundColor: `${accentColor}15`,
                      color: accentColor,
                      px: 1,
                      py: 0.3,
                      borderRadius: 1,
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {q.complexity}pt
                  </Box>
                </Box>
              </CardContent>
            </Card>
          );
        })}
      </Box>
    </Box>
  );
}
