import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const TableExportOnly = () => {
  // You can load this from props, API, etc.
  const data = [
    { name: 'Alice', email: 'alice@example.com', age: 25 },
    { name: 'Bob', email: 'bob@example.com', age: 30 },
    { name: 'Charlie', email: 'charlie@example.com', age: 28 },
  ];

  const headers = [['Name', 'Email', 'Age']];
  const body = data.map(row => [row.name, row.email, row.age.toString()]);

  const exportPDF = () => {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'A4' });
    const pageWidth = doc.internal.pageSize.getWidth();

    // Logo (optional)
    const logo = new Image();
    logo.src = '/images/fruits/anjeer.jpg';
    logo.onload = () => {
      doc.addImage(logo, 'JPEG', pageWidth - 140, 20, 100, 50);
      doc.setFontSize(18);
      doc.text('Hidden User Table Report', 40, 50);
      doc.setFontSize(12);
      doc.text('Generated on: ' + new Date().toLocaleDateString(), 40, 70);

      autoTable(doc, {
        head: headers,
        body: body,
        startY: 100,
        theme: 'grid',
        headStyles: { fillColor: [0, 102, 204], textColor: 255 },
        bodyStyles: { fillColor: [245, 245, 245] },
        alternateRowStyles: { fillColor: [255, 255, 255] },
        styles: { fontSize: 10, cellPadding: 6 },
        didDrawPage: (data) => {
          const pageCount = doc.internal.getNumberOfPages();
          const pageHeight = doc.internal.pageSize.getHeight();
          doc.setFontSize(9);
          doc.text(
            `Page ${doc.internal.getCurrentPageInfo().pageNumber} of ${pageCount}`,
            pageWidth - 100,
            pageHeight - 20
          );
        }
      });

      doc.save('hidden-table.pdf');
    };
  };

  const exportCSV = () => {
    const csvRows = [
      headers[0].join(','),
      ...data.map(row => [row.name, row.email, row.age].join(','))
    ];

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'hidden-table.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div>
      <h2>Export Only</h2>
      <button onClick={exportPDF}>Export to PDF</button>
      <button onClick={exportCSV} style={{ marginLeft: '1rem' }}>Export to CSV</button>
    </div>
  );
};

export default TableExportOnly;
