import React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  TextField,
  Stack,
  FormControlLabel,
  Checkbox,
  Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTestConfigStore } from '../../store';
import { HeadersManager } from './HeadersManager';

const JSON_PLACEHOLDER = `{
  "key": "value"
}`;

export function AdvancedOptions() {
  const { options, setOption, setOptions } = useTestConfigStore();

  const handleBasicAuthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOptions({
      basicAuth: {
        ...options.basicAuth,
        enabled: event.target.checked,
      },
    });
  };

  const handleProxyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOptions({
      proxy: {
        ...options.proxy,
        enabled: event.target.checked,
      },
    });
  };

  return (
    <Accordion
      elevation={0}
      sx={{
        border: 1,
        borderColor: 'divider',
        borderRadius: '8px !important',
        '&:before': { display: 'none' },
        '&.Mui-expanded': { margin: 0 },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          minHeight: 48,
          '&.Mui-expanded': { minHeight: 48 },
        }}
      >
        <Typography fontWeight={500}>Advanced Options</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Stack spacing={2.5}>
          {/* Request Body */}
          <TextField
            label="Request Body"
            value={options.body}
            onChange={(e) => setOption('body', e.target.value)}
            placeholder={JSON_PLACEHOLDER}
            size="small"
            multiline
            minRows={3}
            maxRows={10}
            fullWidth
            inputProps={{
              'aria-label': 'Request body',
              style: { fontFamily: 'monospace' },
            }}
          />

          <Divider />

          {/* Headers */}
          <HeadersManager />

          <Divider />

          {/* Basic Authentication */}
          <Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={options.basicAuth.enabled}
                  onChange={handleBasicAuthChange}
                  size="small"
                />
              }
              label={<Typography fontWeight={500}>Basic Authentication</Typography>}
            />
            {options.basicAuth.enabled && (
              <Box sx={{ display: 'flex', gap: 2, mt: 1, ml: 4 }}>
                <TextField
                  placeholder="Username"
                  size="small"
                  value={options.basicAuth.username}
                  onChange={(e) =>
                    setOptions({
                      basicAuth: { ...options.basicAuth, username: e.target.value },
                    })
                  }
                  sx={{ flex: 1 }}
                />
                <TextField
                  placeholder="Password"
                  size="small"
                  type="password"
                  value={options.basicAuth.password}
                  onChange={(e) =>
                    setOptions({
                      basicAuth: { ...options.basicAuth, password: e.target.value },
                    })
                  }
                  sx={{ flex: 1 }}
                />
              </Box>
            )}
          </Box>

          {/* Proxy */}
          <Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={options.proxy.enabled}
                  onChange={handleProxyChange}
                  size="small"
                />
              }
              label={<Typography fontWeight={500}>Proxy</Typography>}
            />
            {options.proxy.enabled && (
              <Box sx={{ mt: 1, ml: 4 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="http://user:pass@proxy_host.com:port"
                  value={options.proxy.url}
                  onChange={(e) =>
                    setOptions({
                      proxy: { ...options.proxy, url: e.target.value },
                    })
                  }
                />
              </Box>
            )}
          </Box>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}
