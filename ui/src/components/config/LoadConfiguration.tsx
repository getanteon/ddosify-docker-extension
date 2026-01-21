import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  InputAdornment,
  Tooltip,
} from '@mui/material';
import { useTestConfigStore } from '../../store';
import { LoadType } from '../../types';

export function LoadConfiguration() {
  const { options, setOption } = useTestConfigStore();

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 3,
        alignItems: 'center',
        width: '100%',
      }}
    >
      <Tooltip title="Total number of requests to send (max: 5000)" arrow placement="top">
        <TextField
          error={options.requestCount <= 0}
          required
          label="Request Count"
          type="number"
          value={options.requestCount}
          onChange={(e) => setOption('requestCount', Number(e.target.value))}
          sx={{ width: 150 }}
          size="medium"
          inputProps={{
            'aria-label': 'Request Count',
            min: 1,
            max: 5000,
          }}
        />
      </Tooltip>

      <Tooltip title="Test duration in seconds (max: 100)" arrow placement="top">
        <TextField
          error={options.duration <= 0}
          required
          label="Duration"
          type="number"
          value={options.duration}
          onChange={(e) => setOption('duration', Number(e.target.value))}
          sx={{ width: 130 }}
          size="medium"
          InputProps={{
            endAdornment: <InputAdornment position="end">sec</InputAdornment>,
          }}
          inputProps={{
            'aria-label': 'Duration in seconds',
            min: 1,
            max: 100,
          }}
        />
      </Tooltip>

      <Tooltip title="Request timeout in seconds" arrow placement="top">
        <TextField
          required
          label="Timeout"
          type="number"
          value={options.timeout}
          onChange={(e) => setOption('timeout', Number(e.target.value))}
          sx={{ width: 130 }}
          size="medium"
          InputProps={{
            endAdornment: <InputAdornment position="end">sec</InputAdornment>,
          }}
          inputProps={{
            'aria-label': 'Timeout in seconds',
            min: 1,
          }}
        />
      </Tooltip>

      <FormControl>
        <FormLabel id="load-type-label" sx={{ fontSize: '0.875rem', mb: 0.5 }}>
          Load Type
        </FormLabel>
        <RadioGroup
          row
          aria-labelledby="load-type-label"
          name="load-type-group"
          value={options.loadType}
          onChange={(e) => setOption('loadType', e.target.value as LoadType)}
        >
          <Tooltip title="Constant load throughout the test" arrow>
            <FormControlLabel value="linear" control={<Radio size="small" />} label="Linear" />
          </Tooltip>
          <Tooltip title="Gradually increasing load" arrow>
            <FormControlLabel
              value="incremental"
              control={<Radio size="small" />}
              label="Incremental"
            />
          </Tooltip>
          <Tooltip title="Sinusoidal load pattern" arrow>
            <FormControlLabel value="waved" control={<Radio size="small" />} label="Waved" />
          </Tooltip>
        </RadioGroup>
      </FormControl>
    </Box>
  );
}
