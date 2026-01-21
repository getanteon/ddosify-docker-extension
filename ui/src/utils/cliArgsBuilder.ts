import { TestOptions, Header } from '../types';

export const buildCliArgs = (options: TestOptions, headers: Header[]): string[] => {
  const args: string[] = [
    '-t',
    `${options.protocol}://${options.target}`,
    '-n',
    String(options.requestCount),
    '-d',
    String(options.duration),
    '-m',
    options.method,
    '-l',
    options.loadType,
    '-T',
    String(options.timeout),
  ];

  // Add debug flag if enabled for verbose curl-like output
  if (options.debug) {
    args.push('-debug');
  }

  // Add headers
  for (const header of headers) {
    if (header.key && header.value) {
      args.push('-h', `${header.key}:${header.value}`);
    }
  }

  // Add body if present
  if (options.body && options.body.trim() !== '') {
    args.push('-b', options.body);
  }

  // Add basic auth if enabled
  if (
    options.basicAuth.enabled &&
    options.basicAuth.username &&
    options.basicAuth.password
  ) {
    args.push('-a', `${options.basicAuth.username}:${options.basicAuth.password}`);
  }

  // Add proxy if enabled
  if (options.proxy.enabled && options.proxy.url) {
    args.push('-P', options.proxy.url);
  }

  return args;
};

/**
 * Builds a Docker CLI command string for running ddosify
 */
export const buildDockerCommand = (options: TestOptions, headers: Header[]): string => {
  const args = buildCliArgs(options, headers);

  // Escape and quote args that need it
  const escapedArgs = args.map((arg, index) => {
    // Always quote URLs (after -t flag) and values that might have special chars
    const prevArg = args[index - 1];
    const needsQuotes =
      prevArg === '-t' || // URL
      prevArg === '-b' || // Body
      prevArg === '-h' || // Headers
      prevArg === '-a' || // Auth
      prevArg === '-P' || // Proxy
      /[\s"'$`\\,;:!@#%^&*()=]/.test(arg);

    if (needsQuotes) {
      // Escape double quotes and wrap in double quotes
      return `"${arg.replace(/"/g, '\\"')}"`;
    }
    return arg;
  });

  return `docker run -it --rm ddosify/ddosify ddosify ${escapedArgs.join(' ')}`;
};
