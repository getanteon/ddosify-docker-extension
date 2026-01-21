import jsPDF from 'jspdf';
import { TestOptions, Header } from '../../types';
import { ParsedResult } from '../../utils/resultParser';

export const downloadReport = (
  options: TestOptions,
  headers: Header[],
  result: ParsedResult | null,
  streamOutput: string
): void => {
  const doc = new jsPDF();
  const dateOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  const dateTimeString = new Date().toLocaleDateString(undefined, dateOptions);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor('#545454');
  doc.text(`Ddosify Load Test Results - ${dateTimeString}`, 20, 25);

  doc.setFontSize(14);
  doc.setTextColor('#747474');
  doc.text('Configuration:', 20, 45);

  doc.setFontSize(10);
  doc.text('Target URL:', 25, 55);
  doc.setFont('helvetica', 'normal');
  doc.text(`${options.method}   ${options.protocol}://${options.target}`, 60, 55);

  doc.setFont('helvetica', 'bold');
  doc.text('Load Type:', 25, 62);
  doc.setFont('helvetica', 'normal');
  doc.text(`${options.loadType}`, 60, 62);

  doc.setFont('helvetica', 'bold');
  doc.text('Duration:', 25, 69);
  doc.setFont('helvetica', 'normal');
  doc.text(`${options.duration}s`, 60, 69);

  doc.setFont('helvetica', 'bold');
  doc.text('Request Count:', 25, 76);
  doc.setFont('helvetica', 'normal');
  doc.text(`${options.requestCount}`, 60, 76);

  doc.setFont('helvetica', 'bold');
  doc.text('Timeout:', 25, 83);
  doc.setFont('helvetica', 'normal');
  doc.text(`${options.timeout}s`, 60, 83);

  doc.setFont('helvetica', 'bold');
  doc.text('Headers:', 25, 90);
  doc.setFont('helvetica', 'normal');

  let lastIndex = 90;
  headers.forEach((header, index) => {
    if (index < 5) {
      lastIndex = 90 + index * 7;
      doc.text(`${header.key}: ${header.value}`, 60, lastIndex);
    } else if (index === 5) {
      lastIndex = 90 + 5 * 7;
      doc.text('...', 60, lastIndex);
    }
  });

  if (options.basicAuth.enabled && options.basicAuth.username) {
    lastIndex += 7;
    doc.setFont('helvetica', 'bold');
    doc.text('Auth Username:', 25, lastIndex);
    doc.setFont('helvetica', 'normal');
    doc.text(`${options.basicAuth.username}`, 60, lastIndex);
  }

  if (options.proxy.enabled && options.proxy.url) {
    lastIndex += 7;
    doc.setFont('helvetica', 'bold');
    doc.text('Proxy:', 25, lastIndex);
    doc.setFont('helvetica', 'normal');
    doc.text(`${options.proxy.url}`, 60, lastIndex);
  }

  if (options.body) {
    lastIndex += 7;
    doc.setFont('helvetica', 'bold');
    doc.text('Body:', 25, lastIndex);
    doc.setFont('helvetica', 'normal');
    const bodyText = options.body.length > 50 ? options.body.substring(0, 50) + '...' : options.body;
    doc.text(bodyText, 60, lastIndex);
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor('#747474');
  lastIndex += 14;
  doc.text('Result:', 20, lastIndex);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);

  if (result) {
    // Use parsed result
    lastIndex += 10;
    doc.setFont('helvetica', 'bold');
    doc.text('Success Count:', 25, lastIndex);
    doc.setFont('helvetica', 'normal');
    doc.text(`${result.successCount} (${result.successPercent}%)`, 60, lastIndex);

    lastIndex += 7;
    doc.setFont('helvetica', 'bold');
    doc.text('Failed Count:', 25, lastIndex);
    doc.setFont('helvetica', 'normal');
    doc.text(`${result.failedCount} (${result.failedPercent}%)`, 60, lastIndex);

    if (result.successCount > 0) {
      lastIndex += 7;
      doc.setFont('helvetica', 'bold');
      doc.text('Durations (Avg):', 25, lastIndex);

      lastIndex += 7;
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('DNS:', 30, lastIndex);
      doc.setFont('helvetica', 'normal');
      doc.text(`${(result.durations.dns * 1000).toFixed(2)} ms`, 70, lastIndex);

      lastIndex += 5;
      doc.setFont('helvetica', 'bold');
      doc.text('Connection:', 30, lastIndex);
      doc.setFont('helvetica', 'normal');
      doc.text(`${(result.durations.connection * 1000).toFixed(2)} ms`, 70, lastIndex);

      lastIndex += 5;
      doc.setFont('helvetica', 'bold');
      doc.text('TLS:', 30, lastIndex);
      doc.setFont('helvetica', 'normal');
      doc.text(`${(result.durations.tls * 1000).toFixed(2)} ms`, 70, lastIndex);

      lastIndex += 5;
      doc.setFont('helvetica', 'bold');
      doc.text('Server Processing:', 30, lastIndex);
      doc.setFont('helvetica', 'normal');
      doc.text(`${(result.durations.serverProcessing * 1000).toFixed(2)} ms`, 70, lastIndex);

      lastIndex += 5;
      doc.setFont('helvetica', 'bold');
      doc.text('Response Read:', 30, lastIndex);
      doc.setFont('helvetica', 'normal');
      doc.text(`${(result.durations.responseRead * 1000).toFixed(2)} ms`, 70, lastIndex);

      lastIndex += 5;
      doc.setFont('helvetica', 'bold');
      doc.text('Total:', 30, lastIndex);
      doc.setFont('helvetica', 'normal');
      doc.text(`${(result.durations.total * 1000).toFixed(2)} ms`, 70, lastIndex);

      // Status codes
      lastIndex += 10;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('Status Codes:', 25, lastIndex);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');

      result.statusCodes.forEach(({ code, message, count }) => {
        lastIndex += 7;
        doc.text(`${code} (${message}): ${count}`, 30, lastIndex);
      });
    }
  } else {
    // Fallback to parsing stream output (legacy)
    lastIndex += 10;
    doc.text('See attached raw output', 25, lastIndex);
  }

  doc.setDrawColor('#747474');
  doc.line(20, lastIndex + 14, 190, lastIndex + 14);

  lastIndex += 35;
  doc.setFontSize(10);
  doc.setTextColor('#747474');
  doc.setFont('helvetica', 'bold');
  doc.text('Documentation:', 25, lastIndex);
  doc.setTextColor('#0000FF');
  doc.setFont('helvetica', 'normal');
  doc.textWithLink('Ddosify Docs', 65, lastIndex, { url: 'https://getanteon.com/docs/performance-testing' });

  lastIndex += 7;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor('#747474');
  doc.text('Communication:', 25, lastIndex);
  doc.setTextColor('#0000FF');
  doc.setFont('helvetica', 'normal');
  doc.textWithLink('Discord', 65, lastIndex, { url: 'https://discord.com/invite/9KdnrSUZQg/' });

  doc.save('Ddosify_Load_Test_Report.pdf');
};
