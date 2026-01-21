import React from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, Chip } from '@mui/material';
import { StepResult } from '../../types';

interface ErrorDetailsProps {
  failures: StepResult['fail'];
}

export function ErrorDetails({ failures }: ErrorDetailsProps) {
  if (failures.count === 0) {
    return null;
  }

  const serverReasons = Object.entries(failures.server.reasons);

  return (
    <Card variant="outlined" sx={{ borderColor: 'error.main' }}>
      <CardContent>
        <Typography variant="h6" color="error" gutterBottom>
          Error Details
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Total Failures: <Chip label={failures.count} color="error" size="small" />
        </Typography>

        {failures.server.count > 0 && (
          <>
            <Typography variant="subtitle2" gutterBottom>
              Server Errors ({failures.server.count})
            </Typography>
            <List dense>
              {serverReasons.map(([reason, count]) => (
                <ListItem key={reason}>
                  <ListItemText
                    primary={reason}
                    secondary={`Count: ${count}`}
                  />
                </ListItem>
              ))}
            </List>
          </>
        )}

        {failures.assertions.count > 0 && (
          <>
            <Typography variant="subtitle2" gutterBottom>
              Assertion Failures ({failures.assertions.count})
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Check your assertion conditions
            </Typography>
          </>
        )}
      </CardContent>
    </Card>
  );
}
