// printUtils.js
export const generateCurriculumPrintHTML = (data, showArchived) => {
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

    return `
        <html>
            <head>
                <title>Curriculums Table</title>
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
                        th:nth-child(1), td:nth-child(1) { /* Objective */
                            width: 25%;
                        }
                        th:nth-child(2), td:nth-child(2) { /* Curriculum Type */
                            width: 8%;
                        }
                        th:nth-child(3), td:nth-child(3) { /* Resources */
                            width: 8%;
                        }
                        th:nth-child(4), td:nth-child(4) { /* Prerequisite */
                            width: 6%;
                        }
                        th:nth-child(5), td:nth-child(5) { /* Assessment */
                            width: 12%;
                        }
                        th:nth-child(6), td:nth-child(6) { /* Method */
                            width: 12%;
                        }
                        th:nth-child(7), td:nth-child(7) { /* Content */
                            width: 12%;
                        }
                        th:nth-child(8), td:nth-child(8) { /* Number of Hours */
                            width: 5%;
                        }
                        /* Created At, Updated At or Deleted At */
                        ${!showArchived ? `
                            th:nth-child(9), td:nth-child(9) { /* Created At */
                                width: 10%;
                            }
                            th:nth-child(10), td:nth-child(10) { /* Updated At */
                                width: 10%;
                            }
                        ` : `
                            th:nth-child(9), td:nth-child(9) { /* Deleted At */
                                width: 10%;
                            }
                        `}
                    }

                    /* General Styles */
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
                <h2>${showArchived ? 'Archived Curriculums' : 'Active Curriculums'}</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Objective</th>
                            <th>Curriculum Type</th>
                            <th>Resources</th>
                            <th>Prerequisite</th>
                            <th>Assessment</th>
                            <th>Method</th>
                            <th>Content</th>
                            <th>Hours</th>
                            ${!showArchived 
                                ? '<th>Created At</th><th>Updated At</th>' 
                                : '<th>Deleted At</th>'
                            }
                        </tr>
                    </thead>
                    <tbody>
                        ${data.map((curriculum) => `
                            <tr>
                                <td>${curriculum.objective ?? ''}</td>
                                <td>${curriculum.curriculum_type ?? ''}</td>
                                <td>${curriculum.resources ?? ''}</td>
                                <td>${curriculum.prerequisite ?? ''}</td>
                                <td>${curriculum.assessment ?? ''}</td>
                                <td>${curriculum.method ?? ''}</td>
                                <td>${curriculum.content ?? ''}</td>
                                <td>${curriculum.number_of_hours ?? ''}</td>
                                ${
                                    !showArchived
                                        ? `<td>${formatDate(curriculum.created_at)}</td>
                                           <td>${formatDate(curriculum.updated_at)}</td>`
                                        : `<td>${formatDate(curriculum.deleted_at)}</td>`
                                }
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </body>
        </html>
    `;
};
