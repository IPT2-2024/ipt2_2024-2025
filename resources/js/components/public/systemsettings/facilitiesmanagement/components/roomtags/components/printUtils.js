export function generatePrintHTML(filteredData) {
    // Helper function to format date as MM/DD/YYYY, hh:mm:ss AM/PM
    const formatDate = (date) => {
        if (!date) return 'None';  // Return 'None' if no date is provided
        const d = new Date(date);
        const options = {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
        };
        return d.toLocaleString('en-US', options);
    };

    // Generate table rows
    const tableRows = filteredData.map((tag) => {
        const roomTag = tag.room_tag || 'None';
        const roomTagType = tag.room_tag_type || 'None';
        const createdAt = formatDate(tag.created_at); // Format created_at
        const updatedAt = formatDate(tag.updated_at); // Format updated_at

        return `
            <tr>
                <td>${roomTag}</td>
                <td>${roomTagType}</td>
                <td>${createdAt}</td>
                <td>${updatedAt}</td>
            </tr>
        `;
    }).join('');

    // Complete HTML document to print
    const tableHTML = `
        <html>
            <head>
                <title>Print Room Tags</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        font-size: 12px;
                        margin: 20px;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    th, td {
                        border: 1px solid #000;
                        padding: 8px;
                        text-align: left;
                    }
                    th {
                        background: #eee;
                    }
                    @media print {
                        body {
                            margin: 0;
                        }
                    }
                </style>
            </head>
            <body>
                <h2>Room Tags</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Room Tag</th>
                            <th>Room Tag Type</th>
                            <th>Created At</th>
                            <th>Updated At</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
            </body>
        </html>
    `;

    return tableHTML;
}
