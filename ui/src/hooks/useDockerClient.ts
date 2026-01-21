import { useMemo, useCallback } from 'react';
import { createDockerDesktopClient } from '@docker/extension-api-client';
import type { v1 } from '@docker/extension-api-client-types';

// Create client once outside of component
const client = createDockerDesktopClient();

export function useDockerClient(): v1.DockerDesktopClient {
  return useMemo(() => client, []);
}

export function useDockerToast() {
  const ddClient = useDockerClient();

  const success = useCallback(
    (message: string) => {
      ddClient.desktopUI.toast.success(message);
    },
    [ddClient]
  );

  const error = useCallback(
    (message: string) => {
      ddClient.desktopUI.toast.error(message);
    },
    [ddClient]
  );

  const warning = useCallback(
    (message: string) => {
      ddClient.desktopUI.toast.warning(message);
    },
    [ddClient]
  );

  return { success, error, warning };
}

export function useExternalLinks() {
  const ddClient = useDockerClient();

  const openLink = useCallback(
    (url: string) => {
      ddClient.host.openExternal(url);
    },
    [ddClient]
  );

  return {
    openGithub: () => openLink('https://github.com/getanteon/anteon/tree/master/ddosify_engine'),
    openDocs: () => openLink('https://getanteon.com/docs/performance-testing'),
    openDiscord: () => openLink('https://discord.com/invite/9KdnrSUZQg'),
    openDynamicVariables: () =>
      openLink(
        'https://getanteon.com/docs/performance-testing/dynamic-variables-parametrization'
      ),
  };
}
