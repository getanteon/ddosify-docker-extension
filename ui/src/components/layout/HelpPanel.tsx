import React from 'react';
import { Alert, AlertTitle, Box, Link, Stack, Typography } from '@mui/material';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import { useExternalLinks } from '../../hooks';

export function HelpPanel() {
  const { openDynamicVariables } = useExternalLinks();

  return (
    <Alert
      severity="info"
      icon={<LightbulbOutlinedIcon />}
      sx={{
        width: '100%',
        '& .MuiAlert-message': { width: '100%' },
      }}
    >
      <AlertTitle sx={{ fontWeight: 600 }}>Tips</AlertTitle>
      <Stack spacing={0.5}>
        <Typography variant="body2">
          Use <code style={{ color: '#00cfe8', backgroundColor: 'rgba(0,207,232,0.1)', padding: '2px 6px', borderRadius: 4 }}>{'{{_variableName}}'}</code> to inject dynamic variables.{' '}
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault();
              openDynamicVariables();
            }}
            sx={{ fontWeight: 500 }}
          >
            Learn more
          </Link>
        </Typography>
        <Typography variant="body2">
          Use <code style={{ color: '#00cfe8', backgroundColor: 'rgba(0,207,232,0.1)', padding: '2px 6px', borderRadius: 4 }}>host.docker.internal</code> instead of <code style={{ color: '#00cfe8', backgroundColor: 'rgba(0,207,232,0.1)', padding: '2px 6px', borderRadius: 4 }}>localhost</code> to access the host network.
        </Typography>
      </Stack>
    </Alert>
  );
}
