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

interface DurationChartProps {
  durations: ParsedResult['durations'];
}

export function DurationChart({ durations }: DurationChartProps) {
  const theme = useTheme();

  const data = [
    { name: 'DNS', value: durations.dns * 1000, color: '#8884d8' },
    { name: 'Connection', value: durations.connection * 1000, color: '#82ca9d' },
    { name: 'TLS', value: durations.tls * 1000, color: '#ffc658' },
    { name: 'Request Write', value: durations.requestWrite * 1000, color: '#ff7300' },
    { name: 'Server Processing', value: durations.serverProcessing * 1000, color: '#00C49F' },
    { name: 'Response Read', value: durations.responseRead * 1000, color: '#FFBB28' },
  ];

  const chartHeight = data.length * 35 + 40;

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Duration Breakdown (ms)
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
              tickFormatter={(value) => `${value.toFixed(1)}`}
              axisLine={{ stroke: theme.palette.divider }}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={110}
              tick={{ fill: theme.palette.text.secondary, fontSize: 10 }}
              axisLine={{ stroke: theme.palette.divider }}
              interval={0}
            />
            <Tooltip
              formatter={(value: number) => [`${value.toFixed(2)} ms`, 'Duration']}
              contentStyle={{
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
              }}
              labelStyle={{ color: theme.palette.text.primary }}
              itemStyle={{ color: theme.palette.text.primary }}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
              <LabelList
                dataKey="value"
                position="right"
                fill={theme.palette.text.primary}
                fontSize={10}
                formatter={(value: number) => value.toFixed(1)}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
