"use client";

import { useCallback, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import TopicCard from "@/components/quiz/TopicCard";
import QuizQuestion from "@/components/quiz/QuizQuestion";
import QuizResults from "@/components/quiz/QuizResults";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "@/redux/store";
import { complete, createTest, decrementTime, setTestData } from "@/redux/testSlice";
import { openLoginForm, setForbiddenPages } from "@/redux/appSlice";
import { NavItem } from "@/biz/models/NavItems";

export default function QuizPage() {
  const { topics, user } = useSelector((state: RootState) => state.appState);
  const { test, result } = useSelector((state: RootState) => state.testState);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (test) {
      dispatch(
        setForbiddenPages([NavItem.Top, NavItem.Mistakes, NavItem.Profile, NavItem.About])
      );
      return;
    }

    dispatch(setForbiddenPages(user ? [] : [NavItem.Profile]));
  }, [dispatch, test, user]);

  useEffect(() => {
    return () => {
      dispatch(setTestData({ test: null, result: null }));
    };
  }, [dispatch]);

  useEffect(() => {
    if (!test) {
      return;
    }

    const timer = setInterval(() => {
      dispatch(decrementTime());
    }, 1000);

    return () => clearInterval(timer);
  }, [dispatch, test]);

  useEffect(() => {
    if (!test) {
      return;
    }

    if (test.secondsLeft === 0) {
      dispatch(complete(test.testId));
    }
  }, [dispatch, test?.secondsLeft, test?.testId]);

  const handleSelectTopic = useCallback(
    async (topicName: string) => {
      if (!user) {
        dispatch(openLoginForm());
        return;
      }

      await dispatch(createTest(topicName)).unwrap();
    },
    [user, dispatch]
  );

  if (!test && !result) {
    return (
      <>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h3" sx={{ color: "#f1f5f9", fontWeight: 800, mb: 1.5 }}>
            Test Your Knowledge
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "#94a3b8", maxWidth: 500, mx: "auto" }}
          >
            Choose a quiz topic below and challenge yourself with questions on
            programming, databases, frameworks, and more.
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              md: "1fr 1fr 1fr",
            },
            gap: 2.5,
          }}
        >
          {topics.map((topic) => (
            <TopicCard key={topic.id} topic={topic} onSelect={handleSelectTopic} />
          ))}
        </Box>
      </>
    );
  }

  if (test) {
    return <QuizQuestion test={test} />;
  }

  if (result) {
    return <QuizResults result={result} />;
  }

  return null;
}
