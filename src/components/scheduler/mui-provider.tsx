"use client"

import { createTheme, ThemeProvider } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import { StyledEngineProvider } from "@mui/material"
import type React from "react" // Added import for React

const theme = createTheme()

export function MUIProvider({ children }: { children: React.ReactNode }) {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  )
}

