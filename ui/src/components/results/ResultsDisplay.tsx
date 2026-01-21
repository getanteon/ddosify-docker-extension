import React, { useState, useCallback } from 'react';
import {
  Box,
  Grid,
  Stack,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Tooltip,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { ParsedResult } from '../../utils/resultParser';
import { MetricCard } from './MetricCard';
import { DurationChart } from './DurationChart';
import { StatusCodeChart } from './StatusCodeChart';
import { ProgressChart } from './ProgressChart';

interface ResultsDisplayProps {
  result: ParsedResult | null;
  streamOutput: string;
  isRunning: boolean;
}

export function ResultsDisplay({ result, streamOutput, isRunning }: ResultsDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(streamOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [streamOutput]);
  // Show running state
  if (isRunning && !result) {
    return (
      <Box sx={{ mt: 3, visibility: streamOutput === '' ? 'hidden' : 'visible' }}>
        <Box
          component="pre"
          sx={{
            textAlign: 'left',
            border: '3px solid',
            borderColor: 'divider',
            p: 2.5,
            width: '100%',
            overflow: 'auto',
            maxHeight: '300px',
            borderRadius: 1,
            fontSize: '0.875rem',
            fontFamily: 'monospace',
          }}
        >
          {streamOutput}
        </Box>
      </Box>
    );
  }

  // Show nothing if no output and not running
  if (!result && streamOutput === '') {
    return null;
  }

  // Show rich results if we have parsed result
  if (result) {
    const totalRequests = result.successCount + result.failedCount;

    return (
      <Stack spacing={3} sx={{ mt: 3 }}>
        {/* Summary Cards */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <MetricCard
              title="Success Rate"
              value={`${result.successPercent}%`}
              color={result.successPercent === 100 ? 'success' : result.successPercent >= 90 ? 'warning' : 'error'}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <MetricCard
              title="Total Requests"
              value={totalRequests}
              subtitle={`${result.successCount} success, ${result.failedCount} failed`}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <MetricCard
              title="Avg Duration"
              value={`${(result.durations.total * 1000).toFixed(0)}`}
              subtitle="ms"
              color="info"
            />
          </Grid>
        </Grid>

        {/* Charts */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <DurationChart durations={result.durations} />
          </Grid>
          <Grid item xs={12} md={6}>
            <StatusCodeChart statusCodes={result.statusCodes} />
          </Grid>
        </Grid>

        {/* Progress History */}
        {result.progressHistory.length > 1 && (
          <ProgressChart progressHistory={result.progressHistory} />
        )}

        {/* Logs */}
        {streamOutput && (
          <Accordion
            defaultExpanded
            elevation={0}
            sx={{
              border: 1,
              borderColor: 'divider',
              borderRadius: '8px !important',
              '&:before': { display: 'none' },
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                <Typography fontWeight={500}>Logs</Typography>
                <Tooltip title={copied ? 'Copied!' : 'Copy logs'}>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy();
                    }}
                    sx={{ ml: 'auto', mr: 1 }}
                  >
                    {copied ? (
                      <CheckRoundedIcon fontSize="small" color="success" />
                    ) : (
                      <ContentCopyRoundedIcon fontSize="small" />
                    )}
                  </IconButton>
                </Tooltip>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
              <Box
                component="pre"
                sx={{
                  textAlign: 'left',
                  p: 2,
                  m: 0,
                  width: '100%',
                  overflow: 'auto',
                  maxHeight: '300px',
                  fontSize: '0.875rem',
                  fontFamily: 'monospace',
                  backgroundColor: 'action.hover',
                }}
              >
                {streamOutput}
              </Box>
            </AccordionDetails>
          </Accordion>
        )}
      </Stack>
    );
  }

  // Fallback to stream output if no parsed result (debug mode)
  return (
    <Box sx={{ mt: 3 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 1,
        }}
      >
        <Typography variant="subtitle1" fontWeight={500}>
          Debug Output
        </Typography>
        <Tooltip title={copied ? 'Copied!' : 'Copy output'}>
          <IconButton size="small" onClick={handleCopy}>
            {copied ? (
              <CheckRoundedIcon fontSize="small" color="success" />
            ) : (
              <ContentCopyRoundedIcon fontSize="small" />
            )}
          </IconButton>
        </Tooltip>
      </Box>
      <Box
        component="pre"
        sx={{
          textAlign: 'left',
          border: '1px solid',
          borderColor: 'divider',
          p: 2,
          width: '100%',
          overflow: 'auto',
          maxHeight: '400px',
          borderRadius: 1,
          fontSize: '0.875rem',
          fontFamily: 'monospace',
          backgroundColor: 'action.hover',
        }}
      >
        {streamOutput}
      </Box>
    </Box>
  );
}
