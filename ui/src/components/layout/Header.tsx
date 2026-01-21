import React from 'react';
import { Typography, Link, useMediaQuery, Stack } from '@mui/material';
import { useExternalLinks } from '../../hooks';

export function Header() {
  const isDarkModeEnabled = useMediaQuery('(prefers-color-scheme: dark)');
  const { openGithub } = useExternalLinks();

  const logo = isDarkModeEnabled
    ? 'https://d2uj9largygsoq.cloudfront.net/docker/ddosify-logo-db.svg'
    : 'https://d2uj9largygsoq.cloudfront.net/docker/ddosify-logo-wb.svg';

  return (
    <Stack spacing={1} alignItems="center">
      <img
        alt="Ddosify logo"
        height="60px"
        src={logo}
        style={{ display: 'block' }}
      />
      <Typography variant="body1" color="text.secondary" textAlign="center">
        High-performance,{' '}
        <Link
          href="#"
          onClick={(e) => {
            e.preventDefault();
            openGithub();
          }}
          sx={{ fontWeight: 500 }}
        >
          open-source
        </Link>{' '}
        and simple load testing tool.
      </Typography>
    </Stack>
  );
}
