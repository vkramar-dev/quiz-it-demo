"use client";

import React, { useCallback, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  LinearProgress,
  Chip,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import CloseIcon from "@mui/icons-material/Close";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useAppDispatch } from "@/redux/store";
import { answer, cancelTest } from "@/redux/testSlice";
import { AnswerRequestDto } from "@/biz/dto/AnswerRequestDto";
import { CurrentTest } from "@/biz/models/CurrentTest";
import { setForbiddenPages } from "@/redux/appSlice";

interface QuizQuestionProps {
  test: CurrentTest;
}

export default function QuizQuestion({ test }: QuizQuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useAppDispatch();

  const options = [
    test.questionAnswer1,
    test.questionAnswer2,
    test.questionAnswer3,
    test.questionAnswer4,
  ];
  const topicColor = test.testColor;

  const progress = (test.number / test.totalQuestions) * 100;
  const isLastQuestion = test.number >= test.totalQuestions;

  const handleCancel = useCallback(async () => {
    await dispatch(cancelTest(test.testId));
    dispatch(setForbiddenPages([]));
  }, [dispatch, test.testId]);

  const handleNext = useCallback(async () => {
    if (selectedAnswer == null || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const requestDto: AnswerRequestDto = {
        testId: test.testId,
        questionId: test.questionId,
        answerNumber: selectedAnswer + 1,
      };

      await dispatch(answer(requestDto)).unwrap();
      setSelectedAnswer(null);
    } finally {
      setIsSubmitting(false);
    }
  }, [dispatch, selectedAnswer, test.testId, test.questionId, isSubmitting]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const isTimeLow = test.secondsLeft < 61;

  return (
    <Box sx={{ maxWidth: 720, mx: "auto" }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1.5,
          }}
        >
          <Typography variant="body2" sx={{ color: "#94a3b8" }}>
            Question{" "}
            <Box component="span" sx={{ color: topicColor, fontWeight: 700 }}>
              {test.number}
            </Box>
            {" of "}
            {test.totalQuestions}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                color: isTimeLow ? "#ef4444" : "#94a3b8",
                fontWeight: 600,
                fontSize: "0.875rem",
              }}
            >
              <AccessTimeIcon sx={{ fontSize: 18 }} />
              {formatTime(test.secondsLeft)}
            </Box>
            <Chip
              label={test.testName}
              size="small"
              sx={{
                backgroundColor: `${topicColor}15`,
                color: topicColor,
                fontWeight: 600,
                fontSize: "0.75rem",
              }}
            />
          </Box>
        </Box>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 6,
            borderRadius: 3,
            backgroundColor: "rgba(148, 163, 184, 0.1)",
            "& .MuiLinearProgress-bar": {
              backgroundColor: topicColor,
              borderRadius: 3,
            },
          }}
        />
      </Box>

      {/* Question */}
      <Typography
        variant="h5"
        sx={{ color: "#f1f5f9", mb: 3, fontWeight: 700, lineHeight: 1.4 }}
      >
        {test.questionText}
      </Typography>

      {/* Options */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 3 }}>
        {options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const letter = String.fromCharCode(65 + index);

          return (
            <Card
              key={index}
              onClick={() => setSelectedAnswer(index)}
              sx={{
                cursor: "pointer",
                border: `1px solid ${isSelected ? topicColor : "rgba(148, 163, 184, 0.12)"}`,
                backgroundColor: isSelected ? `${topicColor}15` : "#1e293b",
                transition: "all 0.2s ease",
                "&:hover": {
                  borderColor: isSelected ? topicColor : "rgba(148, 163, 184, 0.3)",
                  backgroundColor: isSelected ? `${topicColor}15` : "#253348",
                  transform: "translateX(4px)",
                },
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  py: 1.5,
                  px: 2,
                  "&:last-child": { pb: 1.5 },
                }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: isSelected
                      ? `${topicColor}25`
                      : "rgba(148,163,184,0.08)",
                    color: isSelected ? topicColor : "#64748b",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    flexShrink: 0,
                  }}
                >
                  {letter}
                </Box>
                <Typography
                  variant="body1"
                  sx={{
                    color: isSelected ? topicColor : "#e2e8f0",
                    fontWeight: isSelected ? 600 : 400,
                  }}
                >
                  {option}
                </Typography>
              </CardContent>
            </Card>
          );
        })}
      </Box>

      {/* Action buttons */}
      <Box
        sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        <Button
          variant="outlined"
          onClick={handleCancel}
          disabled={isSubmitting}
          startIcon={<CloseIcon />}
          sx={{
            px: 2.5,
            py: 1,
            borderColor: "rgba(148, 163, 184, 0.3)",
            color: "#94a3b8",
            fontWeight: 600,
            "&:hover": {
              borderColor: "#ef4444",
              color: "#ef4444",
              backgroundColor: "rgba(239, 68, 68, 0.08)",
            },
          }}
        >
          Cancel Test
        </Button>
        <Button
          variant="contained"
          disabled={selectedAnswer === null || isSubmitting}
          onClick={handleNext}
          endIcon={isLastQuestion ? <EmojiEventsIcon /> : <ArrowForwardIcon />}
          sx={{
            px: 3.5,
            py: 1.2,
            backgroundColor: "#10b981",
            color: "#ffffff",
            fontWeight: 700,
            "&:hover": {
              backgroundColor: "#059669",
            },
            "&.Mui-disabled": {
              backgroundColor: "rgba(148, 163, 184, 0.12)",
              color: "rgba(148, 163, 184, 0.4)",
            },
          }}
        >
          {isLastQuestion ? "See Results" : "Next Question"}
        </Button>
      </Box>
    </Box>
  );
}
