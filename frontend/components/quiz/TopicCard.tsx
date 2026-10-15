"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Box,
} from "@mui/material";
import JavascriptIcon from "@mui/icons-material/Javascript";
import CodeIcon from "@mui/icons-material/Code";
import WebIcon from "@mui/icons-material/Web";
import StorageIcon from "@mui/icons-material/Storage";
import TerminalIcon from "@mui/icons-material/Terminal";
import TranslateIcon from "@mui/icons-material/Translate";
import MemoryIcon from "@mui/icons-material/Memory";
import { Topic } from "@/biz/models/Topic";

const iconMap: Record<string, React.ReactElement> = {
  csharp: <TerminalIcon />,
  javascript: <JavascriptIcon />,
  typescript: <CodeIcon />,
  database: <StorageIcon />,
  dotnet: <TerminalIcon />,
  react: <WebIcon />,
  language: <TranslateIcon />,
  cpp: <MemoryIcon />
};

interface TopicCardProps {
  topic: Topic;
  onSelect: (topicId: string) => void;
}

export default function TopicCard({ topic, onSelect }: TopicCardProps) {
  return (
    <Card
      sx={{
        backgroundColor: "#1e293b",
        border: "1px solid rgba(148, 163, 184, 0.1)",
        transition: "all 0.3s ease",
        "&:hover": {
          borderColor: `${topic.themeColor}60`,
          transform: "translateY(-4px)",
          boxShadow: `0 8px 30px ${topic.themeColor}15`,
        },
      }}
    >
      <CardActionArea
        onClick={() => onSelect(topic.name)}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
        }}
      >
        <CardContent sx={{ p: 3, flex: 1, display: "flex", flexDirection: "column" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                backgroundColor: `${topic.themeColor}15`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: topic.themeColor,
                flexShrink: 0,
              }}
            >
              {iconMap[topic.icon] || <CodeIcon />}
            </Box>
            <Typography variant="h6" sx={{ color: "#f1f5f9", fontWeight: 700 }}>
              {topic.name}
            </Typography>
          </Box>

          <Typography variant="body2" sx={{ color: "#94a3b8", mb: 2, lineHeight: 1.6 }}>
            {topic.description}
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: "auto" }}>
            <Typography variant="caption" sx={{ color: "#64748b" }}>
              {topic.questionCount} questions
            </Typography>
            <Typography variant="caption" sx={{ color: topic.themeColor, fontWeight: 600 }}>
              {"Start ->"}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
