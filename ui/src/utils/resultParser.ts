export interface ParsedResult {
  successCount: number;
  failedCount: number;
  successPercent: number;
  failedPercent: number;
  durations: {
    dns: number;
    connection: number;
    tls: number;
    requestWrite: number;
    serverProcessing: number;
    responseRead: number;
    total: number;
  };
  statusCodes: Array<{ code: string; message: string; count: number }>;
  progressHistory: Array<{
    successCount: number;
    successPercent: number;
    failedCount: number;
    failedPercent: number;
    avgDuration: number;
  }>;
}

export function parseTextResult(output: string): ParsedResult | null {
  try {
    const result: ParsedResult = {
      successCount: 0,
      failedCount: 0,
      successPercent: 0,
      failedPercent: 0,
      durations: {
        dns: 0,
        connection: 0,
        tls: 0,
        requestWrite: 0,
        serverProcessing: 0,
        responseRead: 0,
        total: 0,
      },
      statusCodes: [],
      progressHistory: [],
    };

    // Parse progress lines: ✔️  Successful Run: 12     100%       ❌ Failed Run: 0        0%       ⏱️  Avg. Duration: 0.47544s
    const progressRegex =
      /Successful Run:\s*(\d+)\s+(\d+)%\s+.*Failed Run:\s*(\d+)\s+(\d+)%\s+.*Avg\. Duration:\s*([\d.]+)s/g;
    let match;
    while ((match = progressRegex.exec(output)) !== null) {
      result.progressHistory.push({
        successCount: parseInt(match[1], 10),
        successPercent: parseInt(match[2], 10),
        failedCount: parseInt(match[3], 10),
        failedPercent: parseInt(match[4], 10),
        avgDuration: parseFloat(match[5]),
      });
    }

    // Parse final success/failed counts
    const successMatch = output.match(/Success Count:\s*(\d+)\s*\((\d+)%\)/);
    if (successMatch) {
      result.successCount = parseInt(successMatch[1], 10);
      result.successPercent = parseInt(successMatch[2], 10);
    }

    const failedMatch = output.match(/Failed Count:\s*(\d+)\s*\((\d+)%\)/);
    if (failedMatch) {
      result.failedCount = parseInt(failedMatch[1], 10);
      result.failedPercent = parseInt(failedMatch[2], 10);
    }

    // Parse durations
    const durationPatterns = [
      { key: 'dns', pattern: /DNS\s*:([\d.]+)s/ },
      { key: 'connection', pattern: /Connection\s*:([\d.]+)s/ },
      { key: 'tls', pattern: /TLS\s*:([\d.]+)s/ },
      { key: 'requestWrite', pattern: /Request Write\s*:([\d.]+)s/ },
      { key: 'serverProcessing', pattern: /Server Processing\s*:([\d.]+)s/ },
      { key: 'responseRead', pattern: /Response Read\s*:([\d.]+)s/ },
      { key: 'total', pattern: /Total\s*:([\d.]+)s/ },
    ];

    for (const { key, pattern } of durationPatterns) {
      const durationMatch = output.match(pattern);
      if (durationMatch) {
        result.durations[key as keyof typeof result.durations] = parseFloat(durationMatch[1]);
      }
    }

    // Parse status codes: 404 (Not Found)    :100
    const statusCodeRegex = /(\d{3})\s*\(([^)]+)\)\s*:(\d+)/g;
    while ((match = statusCodeRegex.exec(output)) !== null) {
      result.statusCodes.push({
        code: match[1],
        message: match[2],
        count: parseInt(match[3], 10),
      });
    }

    // Check if we successfully parsed the result section
    if (result.successCount > 0 || result.failedCount > 0 || result.progressHistory.length > 0) {
      return result;
    }

    return null;
  } catch (error) {
    console.error('Failed to parse text result:', error);
    return null;
  }
}
