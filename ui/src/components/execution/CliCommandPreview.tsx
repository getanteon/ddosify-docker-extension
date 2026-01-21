import React, { useState, useCallback } from 'react';
import {
  IconButton,
  Popover,
  Box,
  Typography,
  Tooltip,
} from '@mui/material';
import TerminalRoundedIcon from '@mui/icons-material/TerminalRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { useTestConfigStore } from '../../store';
import { buildDockerCommand } from '../../utils/cliArgsBuilder';

export function CliCommandPreview() {
  const { options, headers } = useTestConfigStore();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [copied, setCopied] = useState(false);

  const command = buildDockerCommand(options, headers);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setCopied(false);
  };

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [command]);

  const open = Boolean(anchorEl);

  return (
    <>
      <Tooltip title="Show Docker CLI command" arrow>
        <IconButton
          size="small"
          onClick={handleClick}
          sx={{
            color: 'text.secondary',
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
            px: 1,
            '&:hover': {
              borderColor: 'text.secondary',
              backgroundColor: 'action.hover',
            },
          }}
        >
          <TerminalRoundedIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              maxWidth: 600,
              minWidth: 400,
            },
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
            <Typography variant="subtitle2" fontWeight={600}>
              Docker CLI Command
            </Typography>
            <Tooltip title={copied ? 'Copied!' : 'Copy command'}>
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
            component="code"
            sx={{
              display: 'block',
              p: 1.5,
              borderRadius: 1,
              backgroundColor: 'action.hover',
              fontSize: '0.8rem',
              fontFamily: 'monospace',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
              lineHeight: 1.5,
              color: 'text.primary',
            }}
          >
            {command}
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.5 }}>
            Run this command in your terminal to execute the same test.
          </Typography>
        </Box>
      </Popover>
    </>
  );
}
