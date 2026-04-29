"use client";

import { Box, Typography, Card, CardContent, Divider, Chip, Button } from "@mui/material";
import QuizIcon from "@mui/icons-material/Quiz";
import BarChartIcon from "@mui/icons-material/BarChart";
import SecurityIcon from "@mui/icons-material/Security";
import SpeedIcon from "@mui/icons-material/Speed";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import WebIcon from "@mui/icons-material/Web";
import StorageIcon from "@mui/icons-material/Storage";
import LockIcon from "@mui/icons-material/Lock";
import { useRouter } from "next/navigation";

const features = [
  {
    icon: <QuizIcon />,
    title: "Diverse Topics",
    description:
      "Quizzes across multiple domains including C#, JavaScript, TypeScript, SQL, .NET, React, and English grammar.",
    color: "#10b981",
  },
  {
    icon: <BarChartIcon />,
    title: "Detailed Statistics",
    description:
      "Track your progress with comprehensive statistics including scores, percentages, and attempt history.",
    color: "#3b82f6",
  },
  {
    icon: <SecurityIcon />,
    title: "Secure Authentication",
    description:
      "JWT-based authentication ensures your data and quiz progress are securely protected.",
    color: "#ef4444",
  },
  {
    icon: <SpeedIcon />,
    title: "Weighted Scoring",
    description:
      "Each question supports weighted scoring, allowing for more nuanced assessment of your knowledge.",
    color: "#f59e0b",
  },
  {
    icon: <EmojiEventsIcon />,
    title: "Instant Results",
    description:
      "Get immediate feedback after completing a quiz with your score, percentage, and grade.",
    color: "#8b5cf6",
  },
  {
    icon: <TrendingUpIcon />,
    title: "Knowledge Growth",
    description:
      "Retake quizzes to improve your scores and track how your knowledge improves over time.",
    color: "#06b6d4",
  },
];

const techStack = {
  frontend: [
    { label: "React with Next.js" },
    { label: "Redux Toolkit for state management" },
    { label: "TypeScript for type safety" },
    { label: "Material UI for styling" },
  ],
  backend: [
    { label: "ASP.NET Core REST API" },
    { label: "Entity Framework Core" },
    { label: "Microsoft SQL Server" },
    { label: "JWT Authentication" },
  ],
};

export default function About() {
  const router = useRouter();

  return (
    <Box>
      {/* Header */}
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography variant="h4" sx={{ color: "#f1f5f9", fontWeight: 800, mb: 1.5 }}>
          About Quiz-IT
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: "#94a3b8", maxWidth: 600, mx: "auto", lineHeight: 1.7 }}
        >
          Quiz-IT is a web-based quiz application built to help developers and learners
          test their knowledge across programming languages, frameworks, databases, and
          more.
        </Typography>
      </Box>

      {/* Features */}
      <Typography variant="h5" sx={{ color: "#f1f5f9", fontWeight: 700, mb: 2 }}>
        Features
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
          gap: 2,
          mb: 4,
        }}
      >
        {features.map((feature, index) => (
          <Card
            key={index}
            sx={{
              backgroundColor: "#1e293b",
              border: "1px solid rgba(148, 163, 184, 0.1)",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ color: feature.color, mb: 1.5 }}>{feature.icon}</Box>
              <Typography
                variant="h6"
                sx={{ color: "#f1f5f9", fontWeight: 700, mb: 1, fontSize: "1rem" }}
              >
                {feature.title}
              </Typography>
              <Typography variant="body2" sx={{ color: "#94a3b8", lineHeight: 1.6 }}>
                {feature.description}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Tech Stack */}
      <Typography variant="h5" sx={{ color: "#f1f5f9", fontWeight: 700, mb: 2 }}>
        Tech Stack
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 2,
          mb: 4,
        }}
      >
        {(["frontend", "backend"] as const).map((stack) => (
          <Card
            key={stack}
            sx={{
              backgroundColor: "#1e293b",
              border: "1px solid rgba(148, 163, 184, 0.1)",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Chip
                label={stack === "frontend" ? "Frontend" : "Backend"}
                size="small"
                sx={{
                  backgroundColor:
                    stack === "frontend"
                      ? "rgba(16, 185, 129, 0.15)"
                      : "rgba(99, 102, 241, 0.15)",
                  color: stack === "frontend" ? "#10b981" : "#6366f1",
                  mb: 2,
                  fontWeight: 700,
                }}
              />
              {techStack[stack].map((item, i) => (
                <Box key={i}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 1 }}>
                    <Box sx={{ color: "#64748b" }}>
                      {stack === "frontend" ? (
                        <WebIcon sx={{ fontSize: 18 }} />
                      ) : i === 3 ? (
                        <LockIcon sx={{ fontSize: 18 }} />
                      ) : (
                        <StorageIcon sx={{ fontSize: 18 }} />
                      )}
                    </Box>
                    <Typography variant="body2" sx={{ color: "#e2e8f0" }}>
                      {item.label}
                    </Typography>
                  </Box>
                  {i < techStack[stack].length - 1 && (
                    <Divider sx={{ borderColor: "rgba(148, 163, 184, 0.06)" }} />
                  )}
                </Box>
              ))}
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* CTA */}
      <Card
        sx={{ backgroundColor: "#1e293b", border: "1px solid rgba(16, 185, 129, 0.2)" }}
      >
        <CardContent sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h5" sx={{ color: "#f1f5f9", fontWeight: 700, mb: 1 }}>
            Ready to Test Your Knowledge?
          </Typography>
          <Typography variant="body1" sx={{ color: "#94a3b8", mb: 2 }}>
            Choose a topic and start your challenge now.
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
            Start a Quiz
          </Button>
        </CardContent>
      </Card>
      <Typography
        variant="caption"
        sx={{ color: "#64748b", mt: 2, textAlign: "center", display: "block" }}
      >
        Questions or feedback? Reach out at{" "}
        <Box
          component="a"
          href="mailto:vkramar.biz@gmail.com"
          sx={{ color: "#10b981", textDecoration: "none" }}
        >
          vkramar.biz@gmail.com
        </Box>
      </Typography>
    </Box>
  );
}
