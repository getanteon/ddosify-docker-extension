import React from 'react';
import { Box, Typography, Link, Stack, Divider } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import ForumRoundedIcon from '@mui/icons-material/ForumRounded';
import { useExternalLinks } from '../../hooks';

export function Footer() {
  const { openGithub, openDocs, openDiscord } = useExternalLinks();

  return (
    <Box
      sx={{
        py: 3,
        px: 4,
        borderRadius: 2,
        border: 1,
        borderColor: 'divider',
        textAlign: 'center',
      }}
    >
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Need help or want to contribute?
      </Typography>
      <Stack
        direction="row"
        spacing={3}
        justifyContent="center"
        divider={<Divider orientation="vertical" flexItem />}
      >
        <Link
          href="#"
          onClick={(e) => {
            e.preventDefault();
            openGithub();
          }}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            textDecoration: 'none',
            color: 'text.secondary',
            '&:hover': { color: 'primary.main' },
          }}
        >
          <GitHubIcon fontSize="small" />
          <Typography variant="body2">GitHub</Typography>
        </Link>
        <Link
          href="#"
          onClick={(e) => {
            e.preventDefault();
            openDocs();
          }}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            textDecoration: 'none',
            color: 'text.secondary',
            '&:hover': { color: 'primary.main' },
          }}
        >
          <MenuBookRoundedIcon fontSize="small" />
          <Typography variant="body2">Documentation</Typography>
        </Link>
        <Link
          href="#"
          onClick={(e) => {
            e.preventDefault();
            openDiscord();
          }}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            textDecoration: 'none',
            color: 'text.secondary',
            '&:hover': { color: 'primary.main' },
          }}
        >
          <ForumRoundedIcon fontSize="small" />
          <Typography variant="body2">Discord</Typography>
        </Link>
      </Stack>
    </Box>
  );
}
