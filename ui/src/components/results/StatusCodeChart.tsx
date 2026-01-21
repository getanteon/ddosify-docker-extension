import React from 'react';
import { Card, CardContent, Typography, useTheme } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from 'recharts';
import { ParsedResult } from '../../utils/resultParser';

interface StatusCodeChartProps {
  statusCodes: ParsedResult['statusCodes'];
}

const getStatusCodeColor = (code: string): string => {
  const statusCode = parseInt(code, 10);
  if (statusCode >= 200 && statusCode < 300) return '#4caf50';
  if (statusCode >= 300 && statusCode < 400) return '#2196f3';
  if (statusCode >= 400 && statusCode < 500) return '#ff9800';
  if (statusCode >= 500) return '#f44336';
  return '#9e9e9e';
};

export function StatusCodeChart({ statusCodes }: StatusCodeChartProps) {
  const theme = useTheme();

  const data = statusCodes
    .map(({ code, message, count }) => ({
      name: code,
      fullName: `${code} ${message}`,
      count,
      color: getStatusCodeColor(code),
    }))
    .sort((a, b) => b.count - a.count);

  if (data.length === 0) {
    return null;
  }

  const chartHeight = Math.max(200, data.length * 40 + 40);

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Status Code Distribution
        </Typography>
        <ResponsiveContainer width="100%" height={chartHeight}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ left: 0, right: 50, top: 5, bottom: 5 }}
          >
            <XAxis
              type="number"
              tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
              axisLine={{ stroke: theme.palette.divider }}
            />
            <YAxis
              type="category"
              dataKey="fullName"
              width={170}
              tick={{ fill: theme.palette.text.secondary, fontSize: 10 }}
              axisLine={{ stroke: theme.palette.divider }}
              interval={0}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
              }}
              labelStyle={{ color: theme.palette.text.primary }}
              itemStyle={{ color: theme.palette.text.primary }}
              formatter={(value: number) => [value, 'Count']}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
              <LabelList
                dataKey="count"
                position="right"
                fill={theme.palette.text.primary}
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
