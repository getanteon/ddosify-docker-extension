import jsPDF from "jspdf";

export const downloadReport = (options, headers, basicAuthChecked, proxyChecked, backendInfo) => {
    let doc = new jsPDF();
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    let dateTimeString = new Date().toLocaleDateString(undefined, dateOptions);

    doc.setFont(undefined, 'bold');
    doc.setFontSize(22);
    doc.setTextColor("#545454");
    doc.text(`Ddosify Load Test Results - ${dateTimeString}`, 20, 25,);

    doc.setFontSize(14);
    doc.setTextColor("#747474");
    doc.text("Configuration:", 20, 45,);

    doc.setFontSize(10);
    doc.text("Target URL:", 25, 55,);
    doc.setFont(undefined, 'normal');
    doc.text(`${options.method}   ${options.protocol}://${options.target}`, 60, 55,);

    doc.setFont(undefined, 'bold');
    doc.text("Load Type:", 25, 62,);
    doc.setFont(undefined, 'normal');
    doc.text(`${options.load_type}`, 60, 62,);

    doc.setFont(undefined, 'bold');
    doc.text("Duration:", 25, 69,);
    doc.setFont(undefined, 'normal');
    doc.text(`${options.duration}`, 60, 69,);

    doc.setFont(undefined, 'bold');
    doc.text("Request Count:", 25, 76,);
    doc.setFont(undefined, 'normal');
    doc.text(`${options.request_count}`, 60, 76,);

    doc.setFont(undefined, 'bold');
    doc.text("Timeout:", 25, 83,);
    doc.setFont(undefined, 'normal');
    doc.text(`${options.timeout}`, 60, 83,);

    doc.setFont(undefined, 'bold');
    doc.text("Headers:", 25, 90,);
    doc.setFont(undefined, 'normal');

    let lastIndex = 0;
    for (let index in headers) {
        lastIndex = 90 + (index) * 7;
        if (index == 5) {
            doc.text("...", 60, lastIndex,);
            break
        }
        doc.text(`${headers[index].key} : ${headers[index].value}`, 60, lastIndex,);
    }

    if (basicAuthChecked && options.basic_auth_username != "") {
        lastIndex = lastIndex + 7;
        doc.setFont(undefined, 'bold');
        doc.text("Auth Username:", 25, lastIndex,);
        doc.setFont(undefined, 'normal');
        doc.text(`${options.basic_auth_username}`, 60, lastIndex,);
    }

    if (proxyChecked && options.proxy != "") {
        lastIndex = lastIndex + 7;
        doc.setFont(undefined, 'bold');
        doc.text("Proxy:", 25, lastIndex,);
        doc.setFont(undefined, 'normal');
        doc.text(`${options.basic_auth_username}`, 60, lastIndex,);
    }

    if (options.body != "") {
        lastIndex = lastIndex + 7;
        doc.setFont(undefined, 'bold');
        doc.text("Body:", 25, lastIndex,);
        doc.setFont(undefined, 'normal');
        doc.text(`${options.body}`, 60, lastIndex,);
    }

    doc.setFont(undefined, 'bold');
    doc.setFontSize(14);
    doc.setTextColor("#747474");
    lastIndex = lastIndex + 14;
    doc.text("Result:", 20, lastIndex);

    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);
    let successCountPerc = backendInfo.substring(backendInfo.indexOf("Success Count:")).split(":    ")[1].split("\n")[0];
    let failedCountPerc = backendInfo.substring(backendInfo.indexOf("Failed Count:")).split(":    ")[1].split("\n")[0];

    let successCount = successCountPerc.split("(")[0].trim();

    lastIndex = lastIndex + 10;
    doc.setFont(undefined, 'bold');
    doc.text("Success Count:", 25, lastIndex,);
    doc.setFont(undefined, 'normal');
    doc.text(successCountPerc.trim(), 60, lastIndex,);

    lastIndex = lastIndex + 7;
    doc.setFont(undefined, 'bold');
    doc.text("Failed Count:", 25, lastIndex,);
    doc.setFont(undefined, 'normal');
    doc.text(failedCountPerc.trim(), 60, lastIndex,);



    if (successCount != 0) {
        let durations = backendInfo.substring(backendInfo.indexOf("Durations (Avg)")).split(" :");

        lastIndex = lastIndex + 7;
        doc.setFont(undefined, 'bold');
        doc.text("Durations:", 25, lastIndex,);

        lastIndex = lastIndex + 7;
        doc.setFontSize(9);
        doc.setFont(undefined, 'bold');
        doc.text("DNS:", 30, lastIndex,);
        doc.setFont(undefined, 'normal');
        doc.text(durations[1].split("\n")[0], 70, lastIndex,);

        lastIndex = lastIndex + 5;
        doc.setFont(undefined, 'bold');
        doc.text("Connection:", 30, lastIndex,);
        doc.setFont(undefined, 'normal');
        doc.text(durations[2].split("\n")[0], 70, lastIndex,);

        lastIndex = lastIndex + 5;
        doc.setFont(undefined, 'bold');
        doc.text("Request Write:", 30, lastIndex,);
        doc.setFont(undefined, 'normal');
        doc.text(durations[3].split("\n")[0], 70, lastIndex,);

        lastIndex = lastIndex + 5;
        doc.setFont(undefined, 'bold');
        doc.text("Server Processing:", 30, lastIndex,);
        doc.setFont(undefined, 'normal');
        doc.text(durations[4].split("\n")[0], 70, lastIndex,);

        lastIndex = lastIndex + 5;
        doc.setFont(undefined, 'bold');
        doc.text("Response Read:", 30, lastIndex,);
        doc.setFont(undefined, 'normal');
        doc.text(durations[5].split("\n")[0], 70, lastIndex,);

        lastIndex = lastIndex + 5;
        doc.setFont(undefined, 'bold');
        doc.text("Total:", 30, lastIndex,);
        doc.setFont(undefined, 'normal');
        doc.text(durations[6].split("\n")[0], 70, lastIndex,);


        let statusCodes = backendInfo.substring(backendInfo.indexOf("Status Code (Message) :Count")).split("\n")[1].split("\n");


        lastIndex = lastIndex + 7;
        doc.setFont(undefined, 'bold');
        doc.setFontSize(10);
        doc.text("Status Codes:", 25, lastIndex,);
        doc.setFontSize(9);
        doc.setFont(undefined, 'normal');


        for (let index in statusCodes) {
            lastIndex = lastIndex + 7;
            doc.text(statusCodes[index], 30, lastIndex,);
        }
    } else {
        lastIndex = lastIndex + 7;
        doc.setFont(undefined, 'bold');
        doc.setFontSize(10);
        doc.text("Error Distribution (Count:Reason):", 25, lastIndex,);
        doc.setFontSize(9);
        doc.setFont(undefined, 'normal');

        let errors = backendInfo.substring(backendInfo.indexOf("Error Distribution (Count:Reason):")).split("\n")[1].split("\n");
        for (let index in errors) {
            lastIndex = lastIndex + 7;
            doc.text(errors[index].trim(), 30, lastIndex,);
        }
    }

    doc.setDrawColor("#747474");
    doc.line(20, lastIndex+14, lastIndex, lastIndex+14);

    lastIndex = lastIndex + 35;
    doc.setFontSize(10);
    doc.setTextColor("#747474");
    doc.setFont(undefined, 'bold');
    doc.text("Advanced Reporting: ", 25, lastIndex,);
    doc.setTextColor("#0000FF");
    doc.setFont(undefined, 'normal');
    doc.textWithLink('Ddosify Cloud', 65, lastIndex, { url: 'https://ddosify.com/' });

    lastIndex = lastIndex + 7;
    doc.setFont(undefined, 'bold');
    doc.setTextColor("#747474");
    doc.text("Communication: ", 25, lastIndex,);
    doc.setTextColor("#0000FF");
    doc.setFont(undefined, 'normal');
    doc.textWithLink('Discord', 65, lastIndex, { url: 'https://discord.gg/9KdnrSUZQg/' });

    doc.save(`Ddosify_Load_Test_Report.pdf`);
};
