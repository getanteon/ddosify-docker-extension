import React, { useCallback } from 'react';
import { Box, TextField, MenuItem } from '@mui/material';
import { useTestConfigStore } from '../../store';
import { useDockerToast } from '../../hooks';
import { AutoSuggestionField } from '../common';
import { PROTOCOLS, METHODS } from '../../constants';
import { parseAndCleanUrl } from '../../utils/urlUtils';

export function TestConfigForm() {
  const { options, setOption, setOptions } = useTestConfigStore();
  const toast = useDockerToast();

  const handleTargetChange = useCallback(
    (value: string) => {
      const { target, protocol, warnings } = parseAndCleanUrl(value, options.protocol);

      // Show warnings as toast
      if (warnings.length > 0) {
        toast.warning(warnings[0]);
      }

      // Update both target and protocol if detected
      if (protocol && protocol !== options.protocol) {
        setOptions({ target, protocol });
      } else {
        setOption('target', target);
      }
    },
    [options.protocol, setOption, setOptions, toast]
  );

  return (
    <Box sx={{ display: 'flex', gap: 1, width: '100%', alignItems: 'flex-start' }}>
      <TextField
        select
        value={options.method}
        onChange={(e) => setOption('method', e.target.value as typeof options.method)}
        sx={{ minWidth: 120 }}
        size="medium"
        inputProps={{
          'aria-label': 'HTTP Method',
        }}
      >
        {METHODS.map((method) => (
          <MenuItem key={method.value} value={method.value}>
            {method.label}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        value={options.protocol}
        onChange={(e) => setOption('protocol', e.target.value as typeof options.protocol)}
        sx={{ minWidth: 100 }}
        size="medium"
        inputProps={{
          'aria-label': 'Protocol',
        }}
      >
        {PROTOCOLS.map((protocol) => (
          <MenuItem key={protocol.value} value={protocol.value}>
            {protocol.label}
          </MenuItem>
        ))}
      </TextField>

      <Box sx={{ flex: 1 }}>
        <AutoSuggestionField
          value={options.target}
          onChange={handleTargetChange}
          error={options.target === ''}
          placeholder="example.com or host.docker.internal:8080"
        />
      </Box>
    </Box>
  );
}
