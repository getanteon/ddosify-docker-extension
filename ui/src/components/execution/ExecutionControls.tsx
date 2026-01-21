import React from 'react';
import { Button, Stack, Tooltip, CircularProgress } from '@mui/material';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import StopRoundedIcon from '@mui/icons-material/StopRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import BugReportRoundedIcon from '@mui/icons-material/BugReportRounded';
import { useTestExecution } from '../../hooks';
import { useTestConfigStore } from '../../store';
import { downloadReport } from '../results/Report';
import { CliCommandPreview } from './CliCommandPreview';

interface ExecutionControlsProps {
  onStart?: () => void;
}

export function ExecutionControls({ onStart }: ExecutionControlsProps) {
  const { options, headers } = useTestConfigStore();
  const { isRunning, enableDownload, streamOutput, result, startTest, startDebug, stopTest } =
    useTestExecution();

  const handleDownloadReport = () => {
    downloadReport(options, headers, result, streamOutput);
  };

  const handleStartTest = () => {
    startTest();
    onStart?.();
  };

  const handleStartDebug = () => {
    startDebug();
    onStart?.();
  };

  const buttonStyle = {
    textTransform: 'none',
    fontWeight: 500,
    fontSize: '0.875rem',
  } as const;

  return (
    <Stack direction="row" spacing={1.5} alignItems="center">
      <Button
        size="medium"
        variant="contained"
        onClick={handleStartTest}
        disabled={isRunning}
        startIcon={
          isRunning ? (
            <CircularProgress size={16} color="inherit" />
          ) : (
            <PlayArrowRoundedIcon fontSize="small" />
          )
        }
        sx={{ ...buttonStyle, minWidth: 100 }}
      >
        {isRunning ? 'Running' : 'Start'}
      </Button>

      <Tooltip title="Single request with verbose output" arrow>
        <Button
          size="medium"
          variant="outlined"
          onClick={handleStartDebug}
          disabled={isRunning}
          startIcon={<BugReportRoundedIcon fontSize="small" />}
          sx={buttonStyle}
        >
          Debug
        </Button>
      </Tooltip>

      <Button
        size="medium"
        variant="outlined"
        color="error"
        onClick={stopTest}
        disabled={!isRunning}
        startIcon={<StopRoundedIcon fontSize="small" />}
        sx={buttonStyle}
      >
        Stop
      </Button>

      <Tooltip title="Download PDF report" arrow>
        <Button
          size="medium"
          variant="outlined"
          color="inherit"
          onClick={handleDownloadReport}
          disabled={!enableDownload}
          startIcon={<DownloadRoundedIcon fontSize="small" />}
          sx={{ ...buttonStyle, color: 'text.secondary' }}
        >
          Download Report
        </Button>
      </Tooltip>

      <CliCommandPreview />
    </Stack>
  );
}
