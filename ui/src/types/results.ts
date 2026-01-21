export interface DdosifyResult {
  success_perc: number;
  fail_perc: number;
  test_status: 'success' | 'fail';
  success_count: number;
  server_fail_count: number;
  assertion_fail_count?: number;
  avg_duration: number;
  steps: Record<string, StepResult>;
}

export interface StepResult {
  name?: string;
  status_code_dist: Record<string, number>;
  fail: {
    count: number;
    assertions: {
      count: number;
      conditions: Record<string, unknown>;
    };
    server: {
      count: number;
      reasons: Record<string, number>;
    };
  };
  durations: DurationMetrics;
  success_count: number;
  success_perc: number;
  fail_perc: number;
}

export interface DurationMetrics {
  connection: number;
  dns: number;
  request_write: number;
  response_read: number;
  server_processing: number;
  tls: number;
  total: number;
}

export interface TestExecutionState {
  isRunning: boolean;
  result: DdosifyResult | null;
  streamOutput: string;
  error: string | null;
}
