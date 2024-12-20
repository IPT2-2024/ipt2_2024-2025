// printUtils.js
export const generatePrintHTML = (data, showArchived) => {
    const formatDate = (date) => {
        if (!date) return '';
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

    let html = `
        <html>
            <head>
                <title>Year Levels Table</title>
                <style>
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
                        background-color: #f2f2f2;
                    }
                </style>
            </head>
            <body>
                <h2>Year Levels Data</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Year Level</th>
    `;

    if (!showArchived) {
        html += `<th>Created At</th><th>Updated At</th>`;
    } else {
        html += `<th>Deleted At</th>`;
    }

    html += `
                        </tr>
                    </thead>
                    <tbody>
    `;

    data.forEach(year => {
        html += `<tr>
                    <td>${year.year_level ?? ''}</td>
        `;

        if (!showArchived) {
            html += `<td>${formatDate(year.created_at)}</td>
                     <td>${formatDate(year.updated_at)}</td>`;
        } else {
            html += `<td>${formatDate(year.deleted_at)}</td>`;
        }

        html += `</tr>`;
    });

    html += `
                    </tbody>
                </table>
            </body>
        </html>
    `;

    return html;
};
