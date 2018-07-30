using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Spreadsheet;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.IO;
using System.Linq;
using System.Net.Mail;
using System.Reflection;
using System.Text;
using System.Web;
using Excel = Microsoft.Office.Interop.Excel;

namespace sgg_farmix_helper
{
    public static class StaticFunctions
    {

        public static IEnumerable<TResult> GetList<TResult>(int cant) where TResult : new()
        {
            Random random = new Random();
            var list = new List<TResult>();
            for (var i = 0; i < cant; i++)
            {
                var item = new TResult();
                var propiedades = typeof(TResult).GetProperties();

                foreach (var pi in propiedades)
                {
                    var tipo = pi.PropertyType;
                    var attr = (ResultAttribute)Attribute.GetCustomAttribute(pi, typeof(ResultAttribute));
                    switch (tipo.Name)
                    {
                        case "String":
                            if (attr.Values == null)
                            {
                                pi.SetValue(item, GetString(random, attr.MaxLength));
                            }
                            else
                            {
                                pi.SetValue(item, GetByValues(random, attr.Values));
                            }
                            break;
                        case "Int32":
                            pi.SetValue(item, GetInteger(random, attr.MinValue, attr.MaxValue));
                            break;
                        case "Boolean":
                            pi.SetValue(item, GetBoolean(random));
                            break;
                        case "DateTime":
                            pi.SetValue(item, GetDate(random, attr.MinDate, attr.MaxDate));
                            break;
                        case "Decimal":
                            pi.SetValue(item, GetDecimal(random, attr.MinValue, attr.MaxValue));
                            break;
                        case "Int64":
                            pi.SetValue(item, GetLong(random, attr.MinValue, attr.MaxValue));
                            break;
                        default:
                            break;
                    }
                }
                ///Codigo Reflection

                list.Add(item);
            }
            return list;
        }
        private static string GetString(Random random, int length)
        {
            StringBuilder builder = new StringBuilder();
            char ch;

            for (int i = 0; i < length; i++)
            {
                ch = Convert.ToChar(Convert.ToInt32(Math.Floor(26 * random.NextDouble() + 65)));
                builder.Append(ch);
            }

            return builder.ToString();
        }

        private static string GetByValues(Random random, string[] values)
        {
            int randomInteger = random.Next(0, values.Length);

            return values[randomInteger];
        }

        private static int GetInteger(Random random, long min, long max)
        {
            int randomInteger = random.Next((int)min, (int)max);

            return randomInteger;
        }

        public static bool GetBoolean(Random random)
        {
            return random.Next(0, 2) == 0;
        }

        private static DateTime GetDate(Random random, string min, string max)
        {
            var auxMin = min.Split('/');
            var auxMax = max.Split('/');
            DateTime minDate = new DateTime(int.Parse(auxMin[0]), int.Parse(auxMin[2]), int.Parse(auxMin[2]));
            DateTime maxDate = new DateTime(int.Parse(auxMax[0]), int.Parse(auxMax[2]), int.Parse(auxMax[2]));

            int range = (maxDate - minDate).Days;
            return minDate.AddDays(random.Next(range));
        }

        private static Decimal GetDecimal(Random random, long min, long max)
        {
            var promedio = (min + (max - min) / 2);
            return Convert.ToDecimal(random.NextDouble() * promedio);
        }

        private static long GetLong(Random random, long min, long max)
        {
            var promedio = (min + (max - min) / 2);
            return Convert.ToInt64(random.NextDouble() * promedio);
        }

        public static ListItem[] GetListItem(int cantidad, string detalle)
        {
            var list = new List<ListItem>();
            ListItem item = new ListItem();

            for (int i = 0; i < cantidad; i++)
            {
                item.Id = (i + 1).ToString();
                item.Text = detalle + item.Id.ToString();

                list.Add(item);
            }

            return list.ToArray();
        }

        public static string GetRandomPassword(Random random, int length)
        {
            StringBuilder builder = new StringBuilder();
            char ch;

            for (int i = 0; i < length / 2; i++)
            {
                int randomInteger = random.Next(0, 5);
                ch = Convert.ToChar(Convert.ToInt32(Math.Floor(26 * random.NextDouble() + 65)));
                builder.Append(ch);
                builder.Append(randomInteger);
            }

            return builder.ToString();
        }

        public static void enviarCorreo(string asunto, bool isHtml, string body, string emailDestinatario)
        {
            SmtpClient SmtpServer = new SmtpClient(ConfigurationManager.AppSettings["Smtp"]);
            var mail = new MailMessage();

            mail.From = new MailAddress(ConfigurationManager.AppSettings["EmailFrom"], "Cooperación Seguros");
            mail.To.Add(emailDestinatario);
            mail.Subject = asunto;
            mail.IsBodyHtml = isHtml;
            mail.Body = body;

            SmtpServer.Port = int.Parse(ConfigurationManager.AppSettings["Port"]);
            SmtpServer.UseDefaultCredentials = false;
            SmtpServer.DeliveryMethod = SmtpDeliveryMethod.Network;
            if (ConfigurationManager.AppSettings["Domain"] != "")
                SmtpServer.Credentials = new System.Net.NetworkCredential(ConfigurationManager.AppSettings["UserName"],
                                                                            ConfigurationManager.AppSettings["Password"],
                                                                            ConfigurationManager.AppSettings["Domain"]);
            else
                SmtpServer.Credentials = new System.Net.NetworkCredential(ConfigurationManager.AppSettings["UserName"],
                                                                            ConfigurationManager.AppSettings["Password"]);
            SmtpServer.EnableSsl = bool.Parse(ConfigurationManager.AppSettings["EnableSsl"]);


            try
            {
                SmtpServer.Send(mail);
                mail.Dispose();
            }
            catch (Exception ex)
            {
                throw new Exception("enviarCorreo: \n" + ex.Message);
            }
        }

        public static void Enviarcorreo2(string asunto, bool isHtml, string body, string emailDestinatario)
        {
            MailMessage msg = new MailMessage();
            msg.To.Add(new MailAddress(emailDestinatario));
            msg.From = new MailAddress(ConfigurationManager.AppSettings["EmailFrom"], "Cooperación Seguros");
            msg.Subject = asunto;
            msg.Body = body;
            msg.IsBodyHtml = isHtml;

            SmtpClient client = new SmtpClient();
            client.UseDefaultCredentials = false;
            client.Credentials = new System.Net.NetworkCredential(ConfigurationManager.AppSettings["UserName"], ConfigurationManager.AppSettings["Password"]);
            client.Port = int.Parse(ConfigurationManager.AppSettings["Port"]);
            client.Host = ConfigurationManager.AppSettings["Smtp"];
            client.DeliveryMethod = SmtpDeliveryMethod.Network;
            client.EnableSsl = true;
            try
            {
                client.Send(msg);
            }
            catch (Exception ex)
            {
                throw new Exception("Enviarcorreo2: \n" + ex.Message);
            }

        }

        public static string ExportToExcel(this DataTable Tbl, string campo, string ExcelFilePath = null)
        {
            try
            {
                if (Tbl == null || Tbl.Columns.Count == 0)
                    throw new Exception("ExportToExcel: Null or empty input table!\n");

                // load excel, and create a new workbook
                Excel.Application excelApp = new Excel.Application();
                excelApp.Workbooks.Add();

                // single worksheet
                Excel._Worksheet workSheet = excelApp.ActiveSheet;

                workSheet.Cells.HorizontalAlignment = Excel.XlHAlign.xlHAlignRight;
                workSheet.Cells.VerticalAlignment = Excel.XlVAlign.xlVAlignCenter;

                // column headings
                for (int i = 0; i < Tbl.Columns.Count; i++)
                {
                    workSheet.Cells[1, (i + 1)] = Tbl.Columns[i].ColumnName;

                    switch (Tbl.Columns[i].ColumnName)
                    {
                        case "Raza":
                            workSheet.Cells[1, (i + 1)].EntireColumn.ColumnWidth = Tbl.Columns[i].ColumnName.Length + 21;
                            break;
                        case "Alimentación":
                            workSheet.Cells[1, (i + 1)].EntireColumn.ColumnWidth = Tbl.Columns[i].ColumnName.Length + 21;
                            break;
                        case "Descripción":
                            workSheet.Cells[1, (i + 1)].EntireColumn.ColumnWidth = Tbl.Columns[i].ColumnName.Length + 21;
                            break;
                        case "Fecha":
                            workSheet.Cells[1, (i + 1)].EntireColumn.ColumnWidth = Tbl.Columns[i].ColumnName.Length + 10;
                            break;
                        default:
                            workSheet.Cells[1, (i + 1)].EntireColumn.ColumnWidth = Tbl.Columns[i].ColumnName.Length + 5;
                            break;
                    }

                }

                // rows
                for (int i = 0; i < Tbl.Rows.Count; i++)
                {
                    // to do: format datetime values before printing
                    for (int j = 0; j < Tbl.Columns.Count; j++)
                    {
                        workSheet.Cells[(i + 2), (j + 1)] = Tbl.Rows[i][j];
                    }
                }

                //Used Range Rows
                Excel.Range rows = workSheet.UsedRange.Rows;

                //set borders 
                rows.Borders.LineStyle = Excel.XlLineStyle.xlContinuous;

                //set gray and bold columns headings
                foreach (Excel.Range row in rows)
                {
                    if (!string.IsNullOrEmpty(row.Cells[1].Value as String))
                    {
                        row.Interior.ColorIndex = 15;
                        row.EntireRow.Font.Bold = true;
                    }
                    break;
                }
                // check fielpath
                if (ExcelFilePath != null && ExcelFilePath != "")
                {
                    string filePath = System.IO.Path.Combine(HttpRuntime.AppDomainAppPath, "Archivos\\");
                    var fecha = DateTime.Now.ToString("dd-MM-yyyy");
                    // Nombre del archivo
                    string fileName = string.Format("{0}-{1}-{2}.xls", ExcelFilePath, campo, fecha);
                    try
                    {
                        using (var ms = new MemoryStream())
                        {
                            excelApp.Workbooks[1].SaveCopyAs(ms);
                            excelApp.Workbooks[1].SaveAs(System.IO.Path.Combine(filePath, fileName), Excel.XlFileFormat.xlWorkbookNormal,
                             System.Reflection.Missing.Value, System.Reflection.Missing.Value, false, false,
                             Excel.XlSaveAsAccessMode.xlShared, false, false, System.Reflection.Missing.Value,
                             System.Reflection.Missing.Value, System.Reflection.Missing.Value);
                            excelApp.Workbooks[1].Close(Missing.Value, Missing.Value, Missing.Value);
                            return fileName;
                        }
                    }
                    catch (Exception ex)
                    {
                        throw new Exception("ExportToExcel: Excel file could not be saved! Check filepath.\n"
                            + ex.Message);
                    }
                }
                else    // no filepath is given
                {
                    excelApp.Visible = true;
                    return null;
                }
            }
            catch (Exception ex)
            {
                throw new Exception("ExportToExcel: \n" + ex.Message);
            }
        }

        public static string GenerateExcel(SLExcelData data, string ExcelFilePath, string campo, string user, string periodo)
        {
            var fecha = DateTime.Now.ToString("dd-MM-yyyy HH:mm");
            var stream = new MemoryStream();
            var document = SpreadsheetDocument
                .Create(stream, SpreadsheetDocumentType.Workbook);

            var workbookpart = document.AddWorkbookPart();
            workbookpart.Workbook = new Workbook();
            var stylesPart = document.WorkbookPart.AddNewPart<WorkbookStylesPart>();
            stylesPart.Stylesheet = GenerateStylesheet();
            stylesPart.Stylesheet.Save();
            var worksheetPart = workbookpart.AddNewPart<WorksheetPart>();            

            var sheetData = new SheetData();
            worksheetPart.Worksheet = new Worksheet(sheetData);

            var sheets = document.WorkbookPart.Workbook.
                AppendChild<Sheets>(new Sheets());

            var sheet = new Sheet()
            {
                Id = document.WorkbookPart
                .GetIdOfPart(worksheetPart),
                SheetId = 1,
                Name = data.SheetName ?? "Reporte"
            };
            sheets.AppendChild(sheet);            

            // Add header
            UInt32 rowIdex = 0;
            var row = new Row { RowIndex = ++rowIdex };
            sheetData.AppendChild(row);
            var cellIdex = 0;

            var campoDato = CreateTextCell(ColumnLetter(cellIdex++),
                   rowIdex, "Campo" ?? string.Empty, 2);
            row.AppendChild(campoDato);
            var usuario = CreateTextCell(ColumnLetter(cellIdex++),
                    rowIdex, "Generado por" ?? string.Empty, 2);
            row.AppendChild(usuario);
            var fechaDato = CreateTextCell(ColumnLetter(cellIdex++),
                    rowIdex, "Fecha" ?? string.Empty, 2);
            row.AppendChild(fechaDato);
            var periodoDato = CreateTextCell(ColumnLetter(cellIdex++),
                    rowIdex, "Período" ?? string.Empty, 2);
            row.AppendChild(periodoDato);
            row = new Row { RowIndex = ++rowIdex };
            sheetData.AppendChild(row);
            cellIdex = 0;
            campoDato = CreateTextCell(ColumnLetter(cellIdex++),
                        rowIdex, campo ?? string.Empty, 1);
            row.AppendChild(campoDato);
            usuario = CreateTextCell(ColumnLetter(cellIdex++),
                        rowIdex, user ?? string.Empty, 1);
            row.AppendChild(usuario);
            fechaDato = CreateTextCell(ColumnLetter(cellIdex++),
                        rowIdex, fecha ?? string.Empty, 1);
            row.AppendChild(fechaDato);
            periodoDato = CreateTextCell(ColumnLetter(cellIdex++),
                        rowIdex, periodo ?? string.Empty, 1);
            row.AppendChild(periodoDato);

            row = new Row { RowIndex = rowIdex + 2 };
            sheetData.AppendChild(row);
            rowIdex += 2;
            cellIdex = 0;

            foreach (var header in data.Headers)
            {
                var cell = CreateTextCell(ColumnLetter(cellIdex++),
                    rowIdex, header ?? string.Empty, 2);
                row.AppendChild(cell);              
            }
            if (data.Headers.Count > 0)
            {
                // Add the column configuration if available
                if (data.ColumnConfigurations != null)
                {
                    var columns = (Columns)data.ColumnConfigurations.Clone();
                    worksheetPart.Worksheet
                        .InsertAfter(columns, worksheetPart
                        .Worksheet.SheetFormatProperties);
                }
            }

            // Add sheet data
            foreach (var rowData in data.DataRows)
            {
                cellIdex = 0;
                row = new Row { RowIndex = ++rowIdex };
                sheetData.AppendChild(row);                
                foreach (var callData in rowData)
                {
                    var cell = CreateTextCell(ColumnLetter(cellIdex++),
                        rowIdex, callData ?? string.Empty, 1);
                    row.AppendChild(cell);
                }
            }

            if (data.HeadersFiltro != null)
            {
                row = new Row { RowIndex = rowIdex + 2};
                sheetData.AppendChild(row);
                rowIdex += 2;
                cellIdex = 0;
                foreach (var header in data.HeadersFiltro)
                {
                    var cell = CreateTextCell(ColumnLetter(cellIdex++),
                        rowIdex, header ?? string.Empty, 2);
                    row.AppendChild(cell);
                }

                foreach (var rowData in data.DataRowsFiltro)
                {
                    cellIdex = 0;
                    row = new Row { RowIndex = ++rowIdex };
                    sheetData.AppendChild(row);
                    foreach (var callData in rowData)
                    {
                        var cell = CreateTextCell(ColumnLetter(cellIdex++),
                            rowIdex, callData ?? string.Empty, 1);
                        row.AppendChild(cell);
                    }
                }
            }

            workbookpart.Workbook.Save();
            document.Close();

            string filePath = System.IO.Path.Combine(HttpRuntime.AppDomainAppPath, "Archivos\\");
            // Nombre del archivo
            fecha = fecha.Replace(':', ' ');
            fecha = fecha.Replace(" ", "");
            string fileName = string.Format("{0}-{1}-{2}.xls", ExcelFilePath, campo, fecha);

            using (MemoryStream stream1 = new MemoryStream())
            {
                stream1.Write(stream.ToArray(), 0, (int)stream.ToArray().Length);
                using (SpreadsheetDocument spreadsheetDoc = SpreadsheetDocument.Open(stream1, true))
                {
                    // Do work here
                }
                File.WriteAllBytes(System.IO.Path.Combine(filePath, fileName), stream1.ToArray());
            }

            return fileName;
        }

        private static Cell CreateTextCell(string header, UInt32 index, string text, uint styleIndex = 0)
        {
            long result = 0;
            Cell cell = null;
            if (long.TryParse(text, out result))
            {
                cell = new Cell
                {
                    DataType = CellValues.Number,
                    CellReference = header + index,
                    StyleIndex = styleIndex
                };
            }
            else
            {
                cell = new Cell
                {
                    DataType = CellValues.InlineString,
                    CellReference = header + index,
                    StyleIndex = styleIndex
                };
            }           
            
            var istring = new InlineString();
            var t = new Text { Text = text };
            istring.AppendChild(t);
            cell.AppendChild(istring);
            return cell;
        }

        private static string ColumnLetter(int intCol)
        {
            var intFirstLetter = ((intCol) / 676) + 64;
            var intSecondLetter = ((intCol % 676) / 26) + 64;
            var intThirdLetter = (intCol % 26) + 65;

            var firstLetter = (intFirstLetter > 64)
                ? (char)intFirstLetter : ' ';
            var secondLetter = (intSecondLetter > 64)
                ? (char)intSecondLetter : ' ';
            var thirdLetter = (char)intThirdLetter;

            return string.Concat(firstLetter, secondLetter,
                thirdLetter).Trim();
        }

        private static Stylesheet GenerateStylesheet()
        {
            Stylesheet styleSheet = null;

            Fonts fonts = new Fonts(
                new Font( // Index 0 - default
                    new FontSize() { Val = 10 },
                    new Bold()
                ),
                new Font( // Index 1 - header
                    new FontSize() { Val = 10 },
                    new Bold(),
                    new Color() { Rgb = "000000" }

                ));

            Fills fills = new Fills(
                    new Fill(new PatternFill() { PatternType = PatternValues.None }), // Index 0 - default
                    new Fill(new PatternFill(new ForegroundColor { Rgb = new HexBinaryValue() { Value = "66666666" } })), // Index 1 - default
                    new Fill(new PatternFill(new ForegroundColor { Rgb = "D9D2D2" })
                    { PatternType = PatternValues.Solid }) // Index 2 - header
                );

            Borders borders = new Borders(
                    new Border(), // index 0 default
                    new Border( // index 1 black border
                        new LeftBorder(new Color() { Auto = true }) { Style = BorderStyleValues.Thin },
                        new RightBorder(new Color() { Auto = true }) { Style = BorderStyleValues.Thin },
                        new TopBorder(new Color() { Auto = true }) { Style = BorderStyleValues.Thin },
                        new BottomBorder(new Color() { Auto = true }) { Style = BorderStyleValues.Thin },
                        new DiagonalBorder())
                );

            CellFormats cellFormats = new CellFormats(
                    new CellFormat(), // default
                    new CellFormat { FontId = 0, FillId = 0, BorderId = 1, ApplyBorder = true }, // header
                    new CellFormat { FontId = 1, FillId = 2, BorderId = 1, ApplyFill = true } // body
                );

            styleSheet = new Stylesheet(fonts, fills, borders, cellFormats);

            return styleSheet;
        }

    }
}
