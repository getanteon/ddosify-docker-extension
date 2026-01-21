import React from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Autocomplete,
  TextField,
  Stack,
} from '@mui/material';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { useTestConfigStore } from '../../store';
import { AutoSuggestionField } from '../common';
import { REQUEST_HEADERS } from '../../constants';

export function HeadersManager() {
  const { headers, addHeader, updateHeader, removeHeader } = useTestConfigStore();

  return (
    <Box>
      <Typography fontWeight={500} sx={{ mb: 1.5 }}>
        Headers
      </Typography>

      <Stack spacing={1.5}>
        {headers.map((header, index) => (
          <Box key={header.id} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Autocomplete
              freeSolo
              disablePortal
              options={REQUEST_HEADERS}
              inputValue={header.key}
              onInputChange={(_, value) => {
                updateHeader(header.id, value ?? '', header.value);
              }}
              sx={{ flex: 1 }}
              size="small"
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Header name"
                  inputProps={{
                    ...params.inputProps,
                    'aria-label': `Header ${index + 1} key`,
                  }}
                />
              )}
            />
            <Box sx={{ flex: 1 }}>
              <AutoSuggestionField
                placeholder="Header value"
                value={header.value}
                onChange={(val) => {
                  updateHeader(header.id, header.key, val);
                }}
                size="small"
              />
            </Box>
            <IconButton
              onClick={() => removeHeader(header.id)}
              aria-label={`Remove header ${index + 1}`}
              size="small"
              color="error"
              sx={{ opacity: 0.7, '&:hover': { opacity: 1 } }}
            >
              <DeleteOutlineRoundedIcon fontSize="small" />
            </IconButton>
          </Box>
        ))}
      </Stack>

      <Button
        size="small"
        variant="outlined"
        startIcon={<AddRoundedIcon />}
        onClick={addHeader}
        sx={{ textTransform: 'none', mt: 1.5 }}
      >
        Add Header
      </Button>
    </Box>
  );
}
