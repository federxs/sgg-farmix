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
    public class InconsistenciaManager : IManager<Inconsistencia>
    {
        private SqlServerConnection connection;
        public Inconsistencia Create(Inconsistencia entity)
        {
            throw new NotImplementedException();
        }

        public InconsistenciaResolver Create(InconsistenciaResolver entity)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>();
                if (entity.inseminacionAnterior != null && entity.inseminacionNueva != null && entity.inseminacionResultante != null)
                {
                    parametros.Add("@idInseminacionAnterior", entity.inseminacionAnterior.idInseminacion);
                    parametros.Add("@idInseminacionConflictiva", entity.inseminacionNueva.idInseminacion);
                    parametros.Add("@fechaInseminacion", entity.inseminacionResultante.fechaInseminacion);
                    parametros.Add("@tipoInseminacion", entity.inseminacionNueva.idTipoInseminacion);
                    var update = connection.Execute("spResolverInseminacionConflictiva", parametros, System.Data.CommandType.StoredProcedure);
                    if (entity.inseminacionNueva.idTipoInseminacion == 2)
                    {
                        var parametrosToro = new Dictionary<string, object>()
                        {
                            {"@idToro", 0 },
                            {"@idInseminacion", entity.inseminacionAnterior.idInseminacion }
                        };
                        for (int i = 0; i < entity.inseminacionNueva.listaBovinos.Count(); i++)
                        {
                            parametrosToro["@idToro"] = entity.inseminacionNueva.listaBovinos.ElementAt(i).idBovino;
                            update = connection.Execute("spActualizarTorosXInseminacionXConflicto", parametrosToro, System.Data.CommandType.StoredProcedure);
                        }
                    }
                }
                else if (entity.tactoAnterior != null && entity.tactoNuevo != null && entity.tactoResultante != null)
                {
                    parametros.Add("@idInseminacionAnterior", entity.tactoAnterior.idInseminacion);
                    parametros.Add("@idInseminacionConflictiva", entity.tactoNuevo.idInseminacion);
                    parametros.Add("@fechaTactoAnterior", entity.tactoAnterior.fechaTacto);
                    parametros.Add("@fechaTacto", entity.tactoResultante.fechaTacto);
                    parametros.Add("@exitoso", entity.tactoResultante.exitoso);
                    parametros.Add("@idTipoTacto", entity.tactoResultante.idTipoTacto);
                    var update = connection.Execute("spResolverTactoConflictivo", parametros, System.Data.CommandType.StoredProcedure);
                }
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

        public IEnumerable<Inconsistencia> Get(Inconsistencia entity)
        {
            throw new NotImplementedException();
        }

        public Inconsistencia Get(long id)
        {
            throw new NotImplementedException();
        }

        public Inconsistencia GetFilter()
        {
            throw new NotImplementedException();
        }

        public Inconsistencia Update(long id, Inconsistencia entity)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<Inconsistencia> GetList(InconsistenciaFilter filter)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@tipo", filter.tipo },
                    {"@estado", filter.estado },
                    {"@fechaDesde", filter.fechaDesde },
                    {"@fechaHasta", filter.fechaHasta },
                    {"@codigoCampo", filter.codigoCampo },
                    {"@periodo", filter.periodo }
                };
                var lista = connection.GetArray<Inconsistencia>("spObtenerListaInconsistencias", parametros, System.Data.CommandType.StoredProcedure);
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

        public InconsistenciaResolver Get(long idTacto, string fechaTacto, long idTactoConflic, string fechaTactoConfl, long idInsem, long idInsemConflic)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>();
                var obj = new InconsistenciaResolver();
                if (idTacto != 0 && idTactoConflic != 0 && fechaTacto != "" && fechaTactoConfl != "")
                {
                    parametros.Add("@idInseminacion", idTacto);
                    parametros.Add("@fechaTacto", fechaTacto);
                    obj.tactoAnterior = connection.GetArray<Tacto>("spObtenerDatosTacto", parametros, System.Data.CommandType.StoredProcedure).FirstOrDefault();
                    parametros = new Dictionary<string, object>();
                    parametros.Add("@idInseminacion", idTactoConflic);
                    parametros.Add("@fechaTacto", fechaTactoConfl);
                    obj.tactoNuevo = connection.GetArray<Tacto>("spObtenerDatosTactoConflictivo", parametros, System.Data.CommandType.StoredProcedure).FirstOrDefault();
                }
                else if (idInsem != 0 && idInsemConflic != 0)
                {
                    parametros.Add("@idInseminacion", idInsem);
                    obj.inseminacionAnterior = connection.GetArray<InseminacionDetalle>("spObtenerDatosInseminacionXId", parametros, System.Data.CommandType.StoredProcedure).FirstOrDefault();
                    if (obj.inseminacionAnterior.idTipoInseminacion == 2)
                        obj.inseminacionAnterior.listaBovinos = connection.GetArray<BovinoItem>("spObtenerListaTorosXInseminacion", parametros, System.Data.CommandType.StoredProcedure);
                    parametros = new Dictionary<string, object>();
                    parametros.Add("@idInseminacion", idInsemConflic);
                    obj.inseminacionNueva = connection.GetArray<InseminacionDetalle>("spObtenerDatosInseminacionConflictivaXId", parametros, System.Data.CommandType.StoredProcedure).FirstOrDefault();
                    if (obj.inseminacionNueva.idTipoInseminacion == 2)
                        obj.inseminacionNueva.listaBovinos = connection.GetArray<BovinoItem>("spObtenerListaTorosXInseminacionConflictiva", parametros, System.Data.CommandType.StoredProcedure);
                }
                //var lista = connection.GetArray<Inconsistencia>("spObtenerListaInconsistencias", parametros, System.Data.CommandType.StoredProcedure);
                return obj;
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

        public Documento InconsistenciasExportarPDF(InconsistenciaFilter filter)
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
                string fileName = string.Format("{0}-{1}-{2}.pdf", "Conflictos", filter.campo, fecha);
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
                var lista = GetList(filter);
                Font fuente1 = new Font(FontFamily.TIMES_ROMAN, 12.0f, Font.BOLD, BaseColor.BLACK);
                Font fuente2 = new Font(FontFamily.TIMES_ROMAN, 14.0f, Font.BOLD, BaseColor.BLACK);
                Rectangle rect = PageSize.LETTER;
                List<IElement> ie;
                float pageWidth = rect.Width;
                string html = "";
                html = @"
                            <html><head></head><body>
                            <table>
                            <tr><td><b>Inconsistencias</b></td></tr>
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
                    string tipoConflicto, estado;
                    if (filter.tipo == 0) tipoConflicto = "Sin filtro";
                    else
                        tipoConflicto = filter.tipo.ToString();
                    if (filter.estado == 0) estado = "Sin filtro";
                    else if (filter.estado == 2) estado = "Pendiente";
                    else
                        estado = filter.estado.ToString();
                    html = @"
                            <html><head></head><body>
                            <table>
                            <tr><td><b>Filtro Aplicado</b></td><td></td><td></td><td></td></tr>                
                            </table>
                            <table border='1'>
                            <thead>
                            <tr>
                            <th>Tipo Conflicto</th>
                            <th>Estado</th>       
                            <th>Fecha Desde</th>    
                            <th>Fecha Hasta</th>           
                            </tr>               
                            </thead>
                            <tbody>
                            <tr><td>" + tipoConflicto + @"</td><td>" + estado + @"</td><td>" + (filter.fechaDesde == null ? "Sin filtro" : filter.fechaDesde) + @"</td><td>" + (filter.fechaHasta == null ? "Sin filtro" : filter.fechaHasta) + @"</td><td></tr>
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
                            <th>Tipo Conflicto</th>
                            <th>Fecha</th>       
                            <th>Estado</th>              
                            </tr>               
                            </thead>
                            <tbody>";
                    foreach (var item in lista)
                    {
                        html += @"<tr><td>" + item.tipo + @"</td><td>" + item.fecha + @"</td><td>" + item.estado + @"</td></tr>";
                    }
                    html += @"</tbody></table>
                            </body></html> ";
                    ie = HTMLWorker.ParseToList(new StringReader(html), null);
                    foreach (IElement element in ie)
                    {
                        PdfPTable table = element as PdfPTable;

                        if (table != null)
                        {
                            table.SetWidthPercentage(new float[] { (float).3 * pageWidth, (float).3 * pageWidth, (float).3 * pageWidth }, rect);
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
