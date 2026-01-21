import { TestOptions, Header } from '../types';

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export const validateTestOptions = (options: TestOptions): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!options.target || options.target.trim() === '') {
    errors.push({ field: 'target', message: 'Please enter a target URL' });
  }

  if (options.requestCount <= 0) {
    errors.push({ field: 'requestCount', message: 'Request count must be positive' });
  }

  if (options.requestCount > 5000) {
    errors.push({
      field: 'requestCount',
      message: 'Request count is limited to 5000, for more you can use Ddosify Cloud',
    });
  }

  if (options.duration <= 0) {
    errors.push({ field: 'duration', message: 'Duration must be positive' });
  }

  if (options.duration > 100) {
    errors.push({
      field: 'duration',
      message: 'Duration is limited to 100 seconds, for more you can use Ddosify Cloud',
    });
  }

  if (options.timeout <= 0) {
    errors.push({ field: 'timeout', message: 'Timeout must be positive' });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateHeaders = (headers: Header[]): ValidationResult => {
  const errors: ValidationError[] = [];

  headers.forEach((header, index) => {
    if (header.key === '') {
      errors.push({ field: `header-${index}-key`, message: 'Header key cannot be empty' });
    }
    if (header.value === '') {
      errors.push({ field: `header-${index}-value`, message: 'Header value cannot be empty' });
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateAll = (
  options: TestOptions,
  headers: Header[]
): ValidationResult => {
  const optionsResult = validateTestOptions(options);
  const headersResult = validateHeaders(headers);

  return {
    isValid: optionsResult.isValid && headersResult.isValid,
    errors: [...optionsResult.errors, ...headersResult.errors],
  };
};
