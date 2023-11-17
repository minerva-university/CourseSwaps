import { createTheme } from "@mui/material/styles";

const basic_theme = createTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#000000",
      light: "#484848",
      dark: "#000000",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#FFFFFF",
      light: "#F8F8F8",
      dark: "#CCCCCC",
      contrastText: "#000000",
    },
    background: {
      main: "#F5F5F5",
      light: "#FFFFFF",
      dark: "#B3B3B3",
      contrastText: "#000000",
    },
  },
  typography: {
    fontFamily: "Open Sans, sans-serif, Arial",
    fontWeightLight: 300,
    fontWeightRegular: 450,
    fontWeightMedium: 500,
    fontWeightBold: 600,
  },
  shadows: Array(25).fill("none"),
});

export default basic_theme;
