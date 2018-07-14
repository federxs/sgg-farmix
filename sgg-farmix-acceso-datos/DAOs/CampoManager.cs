using iTextSharp.text;
using iTextSharp.text.html.simpleparser;
using iTextSharp.text.pdf;
using sgg_farmix_acceso_datos.Helper;
using sgg_farmix_acceso_datos.Model;
using sgg_farmix_helper;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using static iTextSharp.text.Font;

namespace sgg_farmix_acceso_datos.DAOs
{
    public class CampoManager : IManager<Campo>
    {
        private SqlServerConnection connection;
        public Campo Create(Campo entity)
        {
            try
            {
                connection = new SqlServerConnection();

                var parametros = new Dictionary<string, object>()
                {
                    {"@nombre", entity.nombre },
                    {"@superficie", entity.superficie },
                    {"@idLocalidad", entity.idLocalidad },
                    {"@usuario", entity.usuario }
                };

                if (entity.latitud != 0)
                    parametros.Add("@latitud", entity.latitud);
                if (entity.longitud != 0)
                    parametros.Add("@longitud", entity.longitud);

                entity.idCampo = connection.Execute("spRegistrarCampo", parametros, System.Data.CommandType.StoredProcedure);
                if (entity.idCampo == 0)
                    throw new ArgumentException("CreateCampoError");
                return entity;
            }
            catch (Exception ex)
            {
                throw;
            }
            finally
            {
                connection.Close();
                connection = null;
            }
        }

        public void Delete(long id)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<Campo> Get(Campo entity)
        {
            throw new NotImplementedException();
        }

        public Campo Get(long id)
        {
            throw new NotImplementedException();
        }

        public Campo GetFilter()
        {
            throw new NotImplementedException();
        }

        public Campo Update(long id, Campo entity)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<Campo> GetList(string usuario, long idRol)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@usuario", usuario },
                    {"@idRol", idRol }
                };
                var campos = connection.GetArray<Campo>("spGetCampos", parametros, System.Data.CommandType.StoredProcedure);
                return campos;
            }
            catch (Exception ex)
            {
                throw;
            }
            finally
            {
                connection.Close();
                connection = null;
            }
        }

        public ResultadoValidacionCampo ValidarCantidadCampos(string usuario)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@usuario", usuario }
                };
                var resultado = connection.GetArray<ResultadoValidacionCampo>("spValidarCantidadCamposXUsuario", parametros, System.Data.CommandType.StoredProcedure);
                return resultado.First();
            }
            catch (Exception ex)
            {
                throw;
            }
            finally
            {
                connection.Close();
                connection = null;
            }
        }

        public ResultadoValidacion GetInconsistencias(long codigoCampo)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@codigoCampo", codigoCampo }
                };
                var resultado = connection.GetArray<ResultadoValidacion>("spObtenerInconsistenciasPorCampo", parametros, System.Data.CommandType.StoredProcedure);
                return resultado.First();
            }
            catch (Exception ex)
            {
                throw;
            }
            finally
            {
                connection.Close();
                connection = null;
            }
        }

        public IEnumerable<BovinoItem> GetToros(long codigoCampo)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@codigoCampo", codigoCampo }
                };
                var toros = connection.GetArray<BovinoItem>("spGetTorosCampo", parametros, System.Data.CommandType.StoredProcedure);
                return toros;
            }
            catch (Exception ex)
            {
                throw;
            }
            finally
            {
                connection.Close();
                connection = null;
            }
        }

        public IEnumerable<NacimientoItem> GetNacimientos(NacimientoFilter filter)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@fechaDesde", filter.fechaDesde },
                    {"@fechaHasta", filter.fechaHasta },
                    {"@codigoCampo", filter.codigoCampo },
                    {"@periodo", filter.periodo }
                };
                if (filter.numCaravanaMadre != 0)
                    parametros.Add("@numCaravanaMadre", filter.numCaravanaMadre.ToString());
                if (filter.numCaravanaPadre != 0)
                    parametros.Add("@numCaravanaPadre", filter.numCaravanaPadre.ToString());
                var lista = connection.GetArray<NacimientoItem>("spObtenerListaNacimientos", parametros, System.Data.CommandType.StoredProcedure);
                return lista.ToList();
            }
            catch (Exception ex)
            {
                throw;
            }
            finally
            {
                connection.Close();
                connection = null;
            }
        }

        public Documento NacimientosExportarPDF(NacimientoFilter filter)
        {
            FileStream fs;
            Document doc = null;
            PdfWriter writer;
            try
            {
                doc = new Document();
                // Verifico el directorio
                string filePath = System.IO.Path.Combine(HttpRuntime.AppDomainAppPath, "Archivos\\");
                if (!Directory.Exists(filePath)) Directory.CreateDirectory(filePath);

                var fecha = DateTime.Now.ToString("dd-MM-yyyy");
                // Nombre del archivo
                string fileName = string.Format("{0}-{1}-{2}.pdf", "Nacimientos", filter.campo, fecha);
                // Generación del PDF
                fs = new FileStream(System.IO.Path.Combine(filePath, fileName), FileMode.Create, FileAccess.Write, FileShare.None);

                writer = PdfWriter.GetInstance(doc, fs);
                doc.Open();
                string pathImg1 = System.IO.Path.Combine(HttpRuntime.AppDomainAppPath, "Archivos\\logo_farmix.jpg");
                Image image1;
                if (Image.GetInstance(pathImg1) != null)
                {
                    image1 = Image.GetInstance(pathImg1);
                    image1.ScalePercent(24F);
                    image1.Alignment = Element.ALIGN_CENTER;
                    doc.Add(image1);
                }
                //añadimos linea negra abajo de las imagenes para separar.
                doc.Add(new Paragraph(new Chunk(new iTextSharp.text.pdf.draw.LineSeparator(2.0F, 100.0F, BaseColor.BLACK, Element.ALIGN_LEFT, 1))));
                doc.Add(new Paragraph(" "));
                //Inicio datos
                var lista = GetNacimientos(filter);
                Font fuente1 = new Font(FontFamily.TIMES_ROMAN, 12.0f, Font.BOLD, BaseColor.BLACK);
                Font fuente2 = new Font(FontFamily.TIMES_ROMAN, 14.0f, Font.BOLD, BaseColor.BLACK);
                Rectangle rect = PageSize.LETTER;
                List<IElement> ie;
                float pageWidth = rect.Width;
                string html = "";
                html = @"
                            <html><head></head><body>
                            <table>
                            <tr><td><b>Nacimientos</b></td></tr>
                            <tr><td>Campo: <b>" + filter.campo + @"</b></td></tr>                   
                            </table>
                            </body></html>";
                ie = HTMLWorker.ParseToList(new StringReader(html), null);
                foreach (IElement element in ie)
                {
                    PdfPTable table1 = element as PdfPTable;

                    if (table1 != null)
                    {
                        table1.SetWidthPercentage(new float[] { (float)1 * pageWidth }, rect);
                    }
                    doc.Add(element);
                }
                doc.Add(new Paragraph(" "));
                if (lista.Count() > 0)
                {
                    string caravanaMadre, caravanaPadre;
                    if (filter.numCaravanaMadre == 0) caravanaMadre = "Sin filtro";
                    else
                        caravanaMadre = filter.numCaravanaMadre.ToString();
                    if (filter.numCaravanaPadre == 0) caravanaPadre = "Sin filtro";
                    else
                        caravanaPadre = filter.numCaravanaPadre.ToString();
                    html = @"
                            <html><head></head><body>
                            <table>
                            <tr><td><b>Filtro Aplicado</b></td><td></td><td></td><td></td></tr>                
                            </table>
                            <table border='1'>
                            <thead>
                            <tr>
                            <th>Caravana Madre</th>
                            <th>Caravana Padre</th>       
                            <th>Fecha Desde</th>    
                            <th>Fecha Hasta</th>           
                            </tr>               
                            </thead>
                            <tbody>
                            <tr><td>" + caravanaMadre + @"</td><td>" + caravanaPadre + @"</td><td>" + (filter.fechaDesde == null ? "Sin filtro" : filter.fechaDesde) + @"</td><td>" + (filter.fechaHasta == null ? "Sin filtro" : filter.fechaHasta) + @"</td><td></tr>
                            </tbody></table></body></html>";                    
                    ie = HTMLWorker.ParseToList(new StringReader(html), null);
                    foreach (IElement element in ie)
                    {
                        PdfPTable table = element as PdfPTable;

                        if (table != null)
                        {
                            table.SetWidthPercentage(new float[] { (float).2 * pageWidth, (float).2 * pageWidth, (float).2 * pageWidth, (float).2 * pageWidth }, rect);
                        }
                        doc.Add(element);
                    }
                    doc.Add(new Paragraph(" "));
                    html = @"
                            <html><head></head><body>
                            <table border='1'>
                            <thead>
                            <tr>
                            <th>Caravana Madre</th>
                            <th>Caravana Padre</th>       
                            <th>Fecha Nacimiento</th>              
                            </tr>               
                            </thead>
                            <tbody>";
                    foreach (var item in lista)
                    {
                        html += @"<tr><td>" + (item.numCaravanaMadre == "" ? "Sin datos" : item.numCaravanaMadre) + @"</td><td>" + (item.numCaravanaPadre == "" ? "Sin datos" : item.numCaravanaPadre) + @"</td><td>" + item.fechaNacimiento + @"</td></tr>";
                    }
                    html += @"</tbody></table>
                            </body></html> ";
                    ie = HTMLWorker.ParseToList(new StringReader(html), null);
                    foreach (IElement element in ie)
                    {
                        PdfPTable table = element as PdfPTable;

                        if (table != null)
                        {
                            table.SetWidthPercentage(new float[] { (float).2 * pageWidth, (float).2 * pageWidth, (float).2 * pageWidth }, rect);
                        }
                        doc.Add(element);
                    }
                }
                doc.Close();
                return new Documento() { nombre = fileName };
            }
            catch (Exception ex)
            {
                doc.Close();
                throw ex;
            }
            finally
            {
                fs = null;
                doc = null;
                writer = null;
            }
        }
    }
}
