// printUtils.js
export const generateSubjectPrintHTML = (data, showArchived) => {
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

    // Helper function to map availability
    const mapAvailability = (availability) => {
        if (availability === 1) return 'Active';
        if (availability === 0) return 'Inactive';
        return ''; // Default for undefined or other values
    };

    return `
        <html>
            <head>
                <title>Subjects Table</title>
                <style>
                    @media print {
                        @page {
                            size: A4 landscape;
                            margin: 10mm;
                        }
                        body {
                            font-family: Arial, sans-serif;
                            font-size: 10px;
                            margin: 0;
                            padding: 0;
                        }

                        h2 {
                            font-size: 14px;
                            margin-bottom: 10px;
                            text-align: center;
                        }

                        table { 
                            width: 100%; 
                            border-collapse: collapse; 
                            table-layout: fixed;
                            word-wrap: break-word;
                        }

                        thead {
                            display: table-header-group;
                        }

                        tr {
                            page-break-inside: avoid;
                        }

                        th, td { 
                            border: 1px solid #000; 
                            padding: 4px; 
                            text-align: left; 
                            vertical-align: top;
                        }

                        th {
                            background-color: #f2f2f2;
                            font-weight: bold;
                            font-size: 10px;
                        }

                        td {
                            font-size: 10px;
                        }

                        /* Adjust column widths based on content */
                        th:nth-child(1), td:nth-child(1) { /* Subject Name */
                            width: 15%;
                        }
                        th:nth-child(2), td:nth-child(2) { /* Subject Code */
                            width: 10%;
                        }
                        th:nth-child(3), td:nth-child(3) { /* Classification */
                            width: 10%;
                        }
                        th:nth-child(4), td:nth-child(4) { /* Units */
                            width: 5%;
                        }
                        th:nth-child(5), td:nth-child(5) { /* Subject Description */
                            width: 25%;
                        }
                        th:nth-child(6), td:nth-child(6) { /* Availability */
                            width: 10%;
                        }
                        th:nth-child(7), td:nth-child(7) { /* Subject Category */
                            width: 15%;
                        }

                        /* Created At, Updated At or Deleted At */
                        ${
                            !showArchived
                                ? `
                            th:nth-child(8), td:nth-child(8) { /* Created At */
                                width: 10%;
                            }
                            th:nth-child(9), td:nth-child(9) { /* Updated At */
                                width: 10%;
                            }
                        `
                                : `
                            th:nth-child(8), td:nth-child(8) { /* Deleted At */
                                width: 10%;
                            }
                        `
                        }
                    }

                    /* General Styles for Screen (optional, can be omitted if not needed) */
                    body {
                        margin: 0;
                        padding: 0;
                    }
                    table, th, td {
                        border: 1px solid black;
                    }
                    th, td {
                        padding: 8px;
                        text-align: left;
                        vertical-align: top;
                        word-wrap: break-word;
                    }
                </style>
            </head>
            <body>
                <h2>${showArchived ? 'Archived Subjects' : 'Active Subjects'}</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Subject Name</th>
                            <th>Subject Code</th>
                            <th>Classification</th>
                            <th>Units</th>
                            <th>Subject Description</th>
                            <th>Availability</th>
                            <th>Subject Category</th>
                            ${!showArchived 
                                ? '<th>Created At</th><th>Updated At</th>' 
                                : '<th>Deleted At</th>'
                            }
                        </tr>
                    </thead>
                    <tbody>
                        ${data.map((subject) => `
                            <tr>
                                <td>${subject.subject_name ?? ''}</td>
                                <td>${subject.subject_code ?? ''}</td>
                                <td>${subject.classification ?? ''}</td>
                                <td>${subject.units ?? ''}</td>
                                <td>${subject.subject_description ?? ''}</td>
                                <td>${mapAvailability(subject.availability)}</td>
                                <td>${subject.subject_category ?? ''}</td>
                                ${
                                    !showArchived
                                        ? `<td>${formatDate(subject.created_at)}</td>
                                           <td>${formatDate(subject.updated_at)}</td>`
                                        : `<td>${formatDate(subject.deleted_at)}</td>`
                                }
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </body>
        </html>
    `;
};
