import { useCallback, useRef } from 'react';
import { useDockerClient, useDockerToast } from './useDockerClient';
import { useTestConfigStore, useTestResultsStore } from '../store';
import { buildCliArgs } from '../utils/cliArgsBuilder';
import { validateAll } from '../utils/validation';
import { parseTextResult } from '../utils/resultParser';

export function useTestExecution() {
  const ddClient = useDockerClient();
  const toast = useDockerToast();
  const jsonBufferRef = useRef<string>('');

  const { options, headers } = useTestConfigStore();
  const {
    isRunning,
    result,
    streamOutput,
    enableDownload,
    setRunning,
    setResult,
    appendStreamOutput,
    clearStreamOutput,
    setError,
    setEnableDownload,
  } = useTestResultsStore();

  const executeTest = useCallback(
    async (debugMode: boolean) => {
      // Validate configuration
      const validation = validateAll(options, headers);
      if (!validation.isValid) {
        const firstError = validation.errors[0];
        if (firstError.field === 'requestCount' && options.requestCount > 5000) {
          toast.error(firstError.message);
        } else if (firstError.field === 'duration' && options.duration > 100) {
          toast.error(firstError.message);
        } else if (firstError.field === 'target') {
          toast.warning(firstError.message);
        } else if (firstError.field.startsWith('header')) {
          toast.warning(firstError.message);
        } else {
          toast.error(firstError.message);
        }
        return;
      }

      // Reset state
      clearStreamOutput();
      setResult(null);
      setError(null);
      setEnableDownload(false);
      jsonBufferRef.current = '';
      setRunning(true);

      // Build CLI arguments with debug flag if needed
      const args = buildCliArgs({ ...options, debug: debugMode }, headers);

      try {
        await ddClient.extension.vm?.cli.exec('./ddosify', args, {
          stream: {
            onOutput(data) {
              if (data?.stdout) {
                // Accumulate output
                jsonBufferRef.current += data.stdout;
                // Show progress in stream output (for user feedback)
                appendStreamOutput(data.stdout);
              } else if (data?.stderr) {
                console.error(data.stderr);
                toast.error(data.stderr);
              }
            },
            onError(error) {
              setRunning(false);
              setError(String(error));
              console.error(error);
            },
            onClose(_exitCode) {
              setRunning(false);

              // Parse the text result (only for non-debug mode)
              if (!debugMode) {
                const textOutput = jsonBufferRef.current;
                const parsedResult = parseTextResult(textOutput);
                if (parsedResult) {
                  setResult(parsedResult);
                }
              }
              setEnableDownload(true);
            },
          },
        });
      } catch (error) {
        setRunning(false);
        setError(String(error));
        toast.error('Failed to start test');
      }
    },
    [
      options,
      headers,
      ddClient,
      toast,
      clearStreamOutput,
      setResult,
      setError,
      setEnableDownload,
      setRunning,
      appendStreamOutput,
    ]
  );

  const startTest = useCallback(() => executeTest(false), [executeTest]);
  const startDebug = useCallback(() => executeTest(true), [executeTest]);

  const stopTest = useCallback(async () => {
    try {
      await ddClient.extension.vm?.cli.exec('killall', ['-SIGINT', 'ddosify']);
    } catch (error) {
      console.error('Failed to stop test:', error);
    }
  }, [ddClient]);

  return {
    isRunning,
    result,
    streamOutput,
    enableDownload,
    startTest,
    startDebug,
    stopTest,
  };
}
