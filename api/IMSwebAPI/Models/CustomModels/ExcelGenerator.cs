namespace IMSwebAPI.Models.CustomModels
{
    using DocumentFormat.OpenXml;
    using DocumentFormat.OpenXml.Packaging;
    using DocumentFormat.OpenXml.Spreadsheet;
    using IMSwebAPI.Models.AutoCreatedFromEFC;
    using System.IO;

    public class ExcelGenerator
    {
        public byte[] CreateExcelFileForOrder(Porder data)
        {
            using (var memoryStream = new MemoryStream())
            {
                // Create a new Excel package
                using (var spreadsheetDocument = SpreadsheetDocument.Create(memoryStream, SpreadsheetDocumentType.Workbook))
                {
                    // Create a workbook
                    var workbookPart = spreadsheetDocument.AddWorkbookPart();
                    workbookPart.Workbook = new Workbook();

                    // Create a worksheet
                    var worksheetPart = workbookPart.AddNewPart<WorksheetPart>();
                    worksheetPart.Worksheet = new Worksheet(new SheetData());

                    // Create a worksheet ID
                    var sheetId = spreadsheetDocument.WorkbookPart.GetIdOfPart(worksheetPart);

                    // Create a new sheet and set its name
                    var sheets = spreadsheetDocument.WorkbookPart.Workbook.AppendChild(new Sheets());
                    sheets.Append(new Sheet() { Id = sheetId, SheetId = 1, Name = "Sheet1" });
                    var totalPrimersCount = data.Porderlines
    .Where(rowData => rowData.Requestline?.Primers != null)
    .Sum(rowData => rowData.Requestline.Primers.Count);

                    // Create the header row
                    var sheetData = worksheetPart.Worksheet.GetFirstChild<SheetData>();
                    var headerRow = new Row();

                    var header1 = new Cell(new InlineString(new Text("Product Code")));
                    headerRow.Append(header1);

                    var header2 = new Cell(new InlineString(new Text("Product Description")));
                    headerRow.Append(header2);

                    var header3 = new Cell(new InlineString(new Text("Quantity")));
                    headerRow.Append(header3);

                    if (totalPrimersCount > 0)
                    {
                        var header4 = new Cell(new InlineString(new Text("Sequence Identifier")));
                        headerRow.Append(header4);

                        var header5 = new Cell(new InlineString(new Text("Nucleotide Sequence")));
                        headerRow.Append(header5);
                    }


                    sheetData.Append(headerRow);

                    // Add data rows
                    foreach (var rowData in data.Porderlines)
                    {
                        sheetData = worksheetPart.Worksheet.GetFirstChild<SheetData>();


                        if (rowData.Requestline?.Primers.Count > 0)
                        {

                            foreach (var primer in rowData.Requestline?.Primers)
                            {
                                var row = new Row();

                                var cell1 = new Cell(new InlineString(new Text(rowData.Product.Code.ToString())));
                                row.Append(cell1);

                                var cell2 = new Cell(new InlineString(new Text(rowData.Product.Name.ToString())));
                                row.Append(cell2);

                                var cell3 = new Cell(new InlineString(new Text("1")));
                                row.Append(cell3);

                                var cell4 = new Cell(new InlineString(new Text(primer?.SequenceIdentifier.ToString() ?? "")));
                                row.Append(cell4);
                                var cell5 = new Cell(new InlineString(new Text(primer?.NucleotideSequence.ToString() ?? "")));
                                row.Append(cell5);
                                sheetData.Append(row);
                            }

                        }
                        else
                        {
                            var row = new Row();

                            var cell1 = new Cell(new InlineString(new Text(rowData.Product.Code.ToString())));
                            row.Append(cell1);

                            var cell2 = new Cell(new InlineString(new Text(rowData.Product.Name.ToString())));
                            row.Append(cell2);

                            var cell3 = new Cell(new InlineString(new Text(rowData.Qty.ToString())));
                            row.Append(cell3);

                            // var cell4 = new Cell(new InlineString(new Text("")));
                            //row.Append(cell4);
                            //var cell5 = new Cell(new InlineString(new Text("")));
                            //row.Append(cell5);
                            sheetData.Append(row);
                        }

                    }
                }

                // Return the Excel file as a byte array
                return memoryStream.ToArray();
            }
        }

    }

}



