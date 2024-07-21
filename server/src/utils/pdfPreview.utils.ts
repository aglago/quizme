import Api2Pdf from "api2pdf";

const api2pdfKey = process.env.REACT_APP_AP2PDF_KEY;
const a2pClient = new Api2Pdf(api2pdfKey);

a2pClient
  .libreOfficeThumbnail(
    "https://www.api2pdf.com/wp-content/themes/api2pdf/assets/samples/sample-word-doc.docx"
  )
  .then(function (result: object) {
    console.log(result);
  });
