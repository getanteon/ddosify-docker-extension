import { Protocol } from '../types';

interface ParsedUrl {
  target: string;
  protocol: Protocol | null;
  warnings: string[];
}

export function parseAndCleanUrl(input: string, currentProtocol: Protocol): ParsedUrl {
  const warnings: string[] = [];
  let target = input.trim();
  let detectedProtocol: Protocol | null = null;

  // Detect and strip protocol
  if (target.startsWith('https://')) {
    target = target.slice(8);
    detectedProtocol = 'https';
  } else if (target.startsWith('http://')) {
    target = target.slice(7);
    detectedProtocol = 'http';
  }

  // Warn about localhost (should use host.docker.internal in Docker)
  if (target.startsWith('localhost') || target.startsWith('127.0.0.1')) {
    warnings.push('Use host.docker.internal instead of localhost for Docker');
  }

  return {
    target,
    protocol: detectedProtocol,
    warnings,
  };
}

export function validateUrl(target: string): string | null {
  if (!target) {
    return 'URL is required';
  }

  // Check for spaces
  if (target.includes(' ')) {
    return 'URL cannot contain spaces';
  }

  // Check for invalid characters
  const invalidChars = /[<>{}|\\^`\[\]]/;
  if (invalidChars.test(target)) {
    return 'URL contains invalid characters';
  }

  // Basic format check (should have at least a domain)
  const domainPattern = /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*|^(\d{1,3}\.){3}\d{1,3}/;
  const firstPart = target.split(/[/:]/)[0];
  if (!domainPattern.test(firstPart)) {
    return 'Invalid domain format';
  }

  return null;
}
