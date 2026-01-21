import React from 'react';
import { Card, CardContent, Typography, useTheme } from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { ParsedResult } from '../../utils/resultParser';

interface ProgressChartProps {
  progressHistory: ParsedResult['progressHistory'];
}

export function ProgressChart({ progressHistory }: ProgressChartProps) {
  const theme = useTheme();

  if (progressHistory.length === 0) {
    return null;
  }

  const data = progressHistory.map((entry, index) => ({
    index: index + 1,
    requests: entry.successCount + entry.failedCount,
    avgDuration: entry.avgDuration * 1000, // Convert to ms
  }));

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Test Progress
        </Typography>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data} margin={{ left: 10, right: 30, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
            <XAxis
              dataKey="index"
              tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
              axisLine={{ stroke: theme.palette.divider }}
              label={{
                value: 'Sample',
                position: 'insideBottomRight',
                offset: -5,
                fill: theme.palette.text.secondary,
                fontSize: 10,
              }}
            />
            <YAxis
              yAxisId="left"
              tick={{ fill: theme.palette.text.secondary, fontSize: 10 }}
              axisLine={{ stroke: theme.palette.divider }}
              label={{
                value: 'Requests',
                angle: -90,
                position: 'insideLeft',
                fill: theme.palette.text.secondary,
                fontSize: 10,
              }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fill: theme.palette.text.secondary, fontSize: 10 }}
              axisLine={{ stroke: theme.palette.divider }}
              label={{
                value: 'Avg Duration (ms)',
                angle: 90,
                position: 'insideRight',
                fill: theme.palette.text.secondary,
                fontSize: 10,
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
              }}
              labelStyle={{ color: theme.palette.text.primary }}
              itemStyle={{ color: theme.palette.text.primary }}
              formatter={(value: number, name: string) => [
                name === 'requests' ? value : `${value.toFixed(1)} ms`,
                name === 'requests' ? 'Total Requests' : 'Avg Duration',
              ]}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="requests"
              stroke="#82ca9d"
              strokeWidth={2}
              dot={false}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="avgDuration"
              stroke="#8884d8"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
