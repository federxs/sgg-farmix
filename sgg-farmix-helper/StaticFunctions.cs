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

        public static string GenerateExcel(SLExcelData data, string ExcelFilePath, string campo)
        {
            var stream = new MemoryStream();
            var document = SpreadsheetDocument
                .Create(stream, SpreadsheetDocumentType.Workbook);

            var workbookpart = document.AddWorkbookPart();
            workbookpart.Workbook = new Workbook();
            var stylesPart = document.WorkbookPart.AddNewPart<WorkbookStylesPart>();
            stylesPart.Stylesheet = new Stylesheet();
            stylesPart.Stylesheet.Fills = new Fills();
            stylesPart.Stylesheet.Fills.Count = 1;
            stylesPart.Stylesheet.Borders = new Borders();
            stylesPart.Stylesheet.Borders.Count = 1;
            stylesPart.Stylesheet.CellFormats = new CellFormats();
            stylesPart.Stylesheet.CellFormats.Count = 1;
            stylesPart.Stylesheet.Fonts = new Fonts();
            stylesPart.Stylesheet.Fonts.Count = 1;
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

            foreach (var header in data.Headers)
            {
                var cell = CreateTextCell(ColumnLetter(cellIdex++),
                    rowIdex, header ?? string.Empty);
                row.AppendChild(cell);
                SetBorderAndFillHeader(workbookpart, worksheetPart, cell.CellReference);                
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
                        rowIdex, callData ?? string.Empty);
                    row.AppendChild(cell);
                    SetBorderAndFillBody(workbookpart, worksheetPart, cell.CellReference);
                }
            }

            workbookpart.Workbook.Save();
            document.Close();

            string filePath = System.IO.Path.Combine(HttpRuntime.AppDomainAppPath, "Archivos\\");
            var fecha = DateTime.Now.ToString("dd-MM-yyyy");
            // Nombre del archivo
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

        private static Cell CreateTextCell(string header, UInt32 index, string text)
        {
            long result = 0;
            Cell cell = null;
            if (long.TryParse(text, out result))
            {
                cell = new Cell
                {
                    DataType = CellValues.Number,
                    CellReference = header + index
                };
            }
            else
            {
                cell = new Cell
                {
                    DataType = CellValues.InlineString,
                    CellReference = header + index
                };
            }           
            
            var istring = new InlineString();
            var t = new Text { Text = text };
            istring.AppendChild(t);
            cell.AppendChild(istring);
            return cell;
        }

        private static void SetBorderAndFillHeader(WorkbookPart workbookPart, WorksheetPart workSheetPart, string referencia)
        {
            Cell cell = GetCell(workSheetPart, referencia);

            CellFormat cellFormat = cell.StyleIndex != null ? GetCellFormat(workbookPart, cell.StyleIndex).CloneNode(true) as CellFormat : new CellFormat();
            cellFormat.FillId = InsertFill(workbookPart, GenerateFill());
            cellFormat.BorderId = InsertBorder(workbookPart, GenerateBorder());
            cellFormat.FontId = InsertFont(workbookPart, GenerateFont());

            cell.StyleIndex = InsertCellFormat(workbookPart, cellFormat);
        }

        private static void SetBorderAndFillBody(WorkbookPart workbookPart, WorksheetPart workSheetPart, string referencia)
        {
            Cell cell = GetCell(workSheetPart, referencia);

            CellFormat cellFormat = cell.StyleIndex != null ? GetCellFormat(workbookPart, cell.StyleIndex).CloneNode(true) as CellFormat : new CellFormat();
            //cellFormat.FillId = InsertFill(workbookPart, GenerateFill());
            cellFormat.BorderId = InsertBorder(workbookPart, GenerateBorder());

            cell.StyleIndex = InsertCellFormat(workbookPart, cellFormat);
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

        private static Border GenerateBorder()
        {
            Border border2 = new Border();

            LeftBorder leftBorder2 = new LeftBorder() { Style = BorderStyleValues.Thin };
            Color color1 = new Color() { Indexed = (UInt32Value)64U };

            leftBorder2.Append(color1);

            RightBorder rightBorder2 = new RightBorder() { Style = BorderStyleValues.Thin };
            Color color2 = new Color() { Indexed = (UInt32Value)64U };

            rightBorder2.Append(color2);

            TopBorder topBorder2 = new TopBorder() { Style = BorderStyleValues.Thin };
            Color color3 = new Color() { Indexed = (UInt32Value)64U };

            topBorder2.Append(color3);

            BottomBorder bottomBorder2 = new BottomBorder() { Style = BorderStyleValues.Thin };
            Color color4 = new Color() { Indexed = (UInt32Value)64U };

            bottomBorder2.Append(color4);
            DiagonalBorder diagonalBorder2 = new DiagonalBorder();

            border2.Append(leftBorder2);
            border2.Append(rightBorder2);
            border2.Append(topBorder2);
            border2.Append(bottomBorder2);
            border2.Append(diagonalBorder2);

            return border2;
        }

        private static Fill GenerateFill()
        {
            Fill fill = new Fill();

            PatternFill patternFill = new PatternFill() { PatternType = PatternValues.Solid };
            ForegroundColor foregroundColor1 = new ForegroundColor() { Rgb = "D9D2D2" };
            BackgroundColor backgroundColor1 = new BackgroundColor() { Indexed = (UInt32Value)64U };

            patternFill.Append(foregroundColor1);
            patternFill.Append(backgroundColor1);

            fill.Append(patternFill);

            return fill;
        }

        private static uint InsertBorder(WorkbookPart workbookPart, Border border)
        {
            Borders borders = workbookPart.WorkbookStylesPart.Stylesheet.Elements<Borders>().First();
            borders.Append(border);
            return (uint)borders.Count++;
        }

        private static uint InsertFill(WorkbookPart workbookPart, Fill fill)
        {
            Fills fills = workbookPart.WorkbookStylesPart.Stylesheet.Elements<Fills>().First();
            fills.Append(fill);
            return (uint)fills.Count++;
        }

        private static Cell GetCell(WorksheetPart workSheetPart, string cellAddress)
        {
            return workSheetPart.Worksheet.Descendants<Cell>()
                                        .SingleOrDefault(c => cellAddress.Equals(c.CellReference));
        }

        private static CellFormat GetCellFormat(WorkbookPart workbookPart, uint styleIndex)
        {
            return workbookPart.WorkbookStylesPart.Stylesheet.Elements<CellFormats>().First().Elements<CellFormat>().ElementAt((int)styleIndex);
        }

        private static uint InsertCellFormat(WorkbookPart workbookPart, CellFormat cellFormat)
        {
            CellFormats cellFormats = workbookPart.WorkbookStylesPart.Stylesheet.Elements<CellFormats>().First();
            cellFormats.Append(cellFormat);
            return (uint)cellFormats.Count++;
        }

        private static Font GenerateFont()
        {
            Font font2 = new Font();
            Bold bold1 = new Bold();
            FontSize fontSize2 = new FontSize() { Val = 11D };
            Color color2 = new Color() { Theme = (UInt32Value)1U };
            FontName fontName2 = new FontName() { Val = "Calibri" };
            FontFamilyNumbering fontFamilyNumbering2 = new FontFamilyNumbering() { Val = 2 };
            FontScheme fontScheme2 = new FontScheme() { Val = FontSchemeValues.Minor };

            font2.Append(bold1);
            font2.Append(fontSize2);
            font2.Append(color2);
            font2.Append(fontName2);
            font2.Append(fontFamilyNumbering2);
            font2.Append(fontScheme2);
            return font2;
        }

        private static uint InsertFont(WorkbookPart workbookPart, Font font)
        {
            Fonts fonts = workbookPart.WorkbookStylesPart.Stylesheet.Elements<Fonts>().First();
            fonts.Append(font);
            return (uint)fonts.Count++;
        }

    }
}
