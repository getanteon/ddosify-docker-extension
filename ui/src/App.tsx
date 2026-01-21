import React, { useRef, useCallback } from 'react';
import { Box, Container, Paper, Stack, Divider } from '@mui/material';
import { ErrorBoundary } from './components/common';
import {
  Header,
  HelpPanel,
  Footer,
  TestConfigForm,
  LoadConfiguration,
  AdvancedOptions,
  ExecutionControls,
  ResultsDisplay,
} from './components';
import { useTestExecution } from './hooks';

export function App() {
  const { isRunning, result, streamOutput } = useTestExecution();
  const resultsRef = useRef<HTMLDivElement>(null);

  const scrollToResults = useCallback(() => {
    // Small delay to ensure the results section is rendered
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, []);

  return (
    <ErrorBoundary>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack spacing={4}>
          {/* Header with logo and description */}
          <Header />

          {/* Main Configuration Card */}
          <Paper elevation={0} sx={{ p: 3, border: 1, borderColor: 'divider', borderRadius: 2 }}>
            <Stack spacing={3}>
              {/* URL Configuration */}
              <Box>
                <TestConfigForm />
              </Box>

              <Divider />

              {/* Load Configuration */}
              <Box>
                <LoadConfiguration />
              </Box>

              {/* Advanced Options */}
              <AdvancedOptions />
            </Stack>
          </Paper>

          {/* Help Tips */}
          <HelpPanel />

          {/* Execution Controls */}
          <ExecutionControls onStart={scrollToResults} />

          {/* Results Display */}
          <Box ref={resultsRef}>
            <ResultsDisplay
              result={result}
              streamOutput={streamOutput}
              isRunning={isRunning}
            />
          </Box>
        </Stack>

        {/* Footer */}
        <Box sx={{ mt: 4 }}>
          <Footer />
        </Box>
      </Container>
    </ErrorBoundary>
  );
}
