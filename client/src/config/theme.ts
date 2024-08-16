"use client";
import { createTheme } from "@mui/material/styles";
import { sansFont, scriptFont, thaiFont } from "./fonts";

const theme = createTheme({
  typography: {
    fontFamily: sansFont.style.fontFamily,
    h1: {
      fontFamily: scriptFont.style.fontFamily,
      fontSize: 40,
      fontWeight: 700,
    },
    h6: {
      fontFamily: thaiFont.style.fontFamily,
    },
    body2: {
      fontFamily: thaiFont.style.fontFamily,
      color: "#333",
    },
  },
  palette: {
    primary: {
      main: "#eab308",
    },
    secondary: {
      main: "#19857b",
    },
    error: {
      main: "#f44336",
    },
    background: {
      default: "#fff",
    },
  },
  shape: {
    borderRadius: 12,
  },
});

export default theme;
