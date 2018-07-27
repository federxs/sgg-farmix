using iTextSharp.text;
using iTextSharp.text.html.simpleparser;
using iTextSharp.text.pdf;
using sgg_farmix_acceso_datos.Helper;
using sgg_farmix_acceso_datos.Model;
using sgg_farmix_helper;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using static iTextSharp.text.Font;

namespace sgg_farmix_acceso_datos.DAOs
{
    public class InseminacionManager : IManager<Inseminacion>
    {
        private SqlServerConnection connection;
        public Inseminacion Create(Inseminacion entity)
        {
            throw new NotImplementedException();
        }

        public void Delete(long id)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<Inseminacion> Get(Inseminacion entity)
        {
            throw new NotImplementedException();
        }

        public Inseminacion Get(long id)
        {
            throw new NotImplementedException();
        }

        public Inseminacion GetFilter()
        {
            throw new NotImplementedException();
        }

        public Inseminacion Update(long id, Inseminacion entity)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@idInseminacion", id },
                    {"@fechaInseminacion", entity.fechaInseminacion },
                    {"@idTipoInseminacion", entity.tipoInseminacion },
                    {"@fechaEstimadaNacimiento", entity.fechaEstimadaNacimiento }
                };
                var update = connection.Execute("spUpdateInseminacionExitosa", parametros, System.Data.CommandType.StoredProcedure);
                if (update == 0)
                    throw new ArgumentException("Update Inseminacion Error");
                if (entity.idToro != 0)
                {
                    parametros = new Dictionary<string, object>()
                    {
                        {"@idInseminacion", id },
                        {"@idToro", entity.idToro }
                    };
                    update = connection.Execute("UpdateToroXInseminacionExitosa", parametros, System.Data.CommandType.StoredProcedure);
                }
                else
                {
                    parametros = new Dictionary<string, object>()
                    {
                        {"@fechaInseminacion", entity.fechaInseminacion }
                    };
                    update = connection.Execute("spDeleteTorosXInseminacion", parametros, System.Data.CommandType.StoredProcedure);
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

        public Inseminacion Insert(Inseminacion entity, List<long> listVacas, List<long> listToros)
        {
            connection = new SqlServerConnection();
            DbTransaction transaction = connection.BeginTransaction();
            try
            {
                var parametros = new Dictionary<string, object>
                {
                    {"@tipoInseminacion", entity.tipoInseminacion },
                    {"@idVaca", 0 },
                    {"@fechaHora", entity.fechaInseminacion },
                    {"@codigoCampo", entity.codigoCampo }
                };
                for (int i = 0; i < listVacas.Count; i++)
                {
                    parametros["@idVaca"] = listVacas.ElementAt(i);
                    entity.idInseminacion = connection.Execute("spRegistrarInseminacion", parametros, System.Data.CommandType.StoredProcedure, transaction);
                    //Si devuelvo un -1 como idInseminacion, esto significa que se inserto una inseminacion conflictiva
                    if (entity.idInseminacion == 0)
                        throw new ArgumentException("Create Inseminacion Error");
                    if (listToros != null && entity.tipoInseminacion == 2)
                    {
                        var parametrosToros = new Dictionary<string, object>
                        {
                            {"@idInseminacion", entity.idInseminacion },
                            {"@idToro", 0 }
                        };
                        //if (listToros.Count == 1)
                        for (int j = 0; j < listToros.Count; j++)
                        {
                            parametrosToros["@idToro"] = listToros.ElementAt(j);
                            var insert = connection.Execute("spRegistrarToroXInseminacion", parametrosToros, System.Data.CommandType.StoredProcedure, transaction);
                            if (insert == 0)
                                throw new ArgumentException("Create Inseminacion Error");
                        }
                    }
                }
                connection.Commit(transaction);
                return entity;
            }
            catch (Exception ex)
            {
                connection.Rollback(transaction);
                throw;
            }
            finally
            {
                connection.Close();
                connection = null;
                transaction = null;
            }
        }

        public InseminacionInit GetInicioInseminacion(long id, string periodo)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@idCampo", id },
                    {"@periodo", periodo }
                };
                var obj = connection.GetArray<InseminacionInit>("spGetInicioInseminacion", parametros, System.Data.CommandType.StoredProcedure).FirstOrDefault();
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

        public IEnumerable<BovinoItem> GetHembrasServicio()
        {
            try
            {
                connection = new SqlServerConnection();
                var lista = connection.GetArray<BovinoItem>("spGetHembrasServicio", null, System.Data.CommandType.StoredProcedure);
                return lista;
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

        public IEnumerable<ServSinConfirmar> GetServiciosSinConfirmar(long idCampo, string periodo)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@idCampo", idCampo },
                    {"@periodo", periodo }
                };
                var lista = connection.GetArray<ServSinConfirmar>("spGetListServSinConfirmar", parametros, System.Data.CommandType.StoredProcedure);
                return lista;
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

        public IEnumerable<ServSinConfirmar> GetInseminacionesXFechaInsem(long id)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@idCampo", id }
                };
                var lista = connection.GetArray<ServSinConfirmar>("spGetListInseminacionesXFecha", parametros, System.Data.CommandType.StoredProcedure);
                return lista;
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

        public IEnumerable<PreniadasXParir> GetPreniadasPorParir(long idCampo, string periodo)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@codigoCampo", idCampo },
                    {"@periodo", periodo }
                };
                var lista = connection.GetArray<PreniadasXParir>("spGetListPreniadasXParir", parametros, System.Data.CommandType.StoredProcedure);
                return lista;
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

        public InseminacionDetalle GetInseminacion(string fecha, int tipoInseminacion)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@fechaInseminacion", fecha },
                    {"@idTipoInseminacion", tipoInseminacion }
                };
                var inseminacion = connection.GetArray<InseminacionDetalle>("spObtenerDatosInseminacion", parametros, System.Data.CommandType.StoredProcedure).FirstOrDefault();
                inseminacion.listaBovinos = connection.GetArray<BovinoItem>("spObtenerBovinosXInseminacion", parametros, System.Data.CommandType.StoredProcedure).ToList();
                parametros.Remove("@idTipoInseminacion");
                if (inseminacion.fechaEstimadaNacimiento != "")
                {
                    parametros = new Dictionary<string, object>
                    {
                        {"@idInseminacion", inseminacion.idInseminacion }
                    };
                    inseminacion.tactos = connection.GetArray<Tacto>("spObtenerTactosXInseminacion", parametros, System.Data.CommandType.StoredProcedure);
                }
                if (inseminacion.idTipoInseminacion == 2)
                {
                    parametros = new Dictionary<string, object>
                    {
                        {"@idInseminacion", inseminacion.idInseminacion }
                    };
                    inseminacion.listaToros = connection.GetArray<BovinoItem>("spObtenerListaTorosXInseminacion", parametros, System.Data.CommandType.StoredProcedure);
                }
                return inseminacion;
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

        public IEnumerable<BovinoItem> GetVacasLactancia(long codigoCampo)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@codigoCampo", codigoCampo }
                };
                var lista = connection.GetArray<BovinoItem>("spGetVacasLactancias", parametros, System.Data.CommandType.StoredProcedure);
                return lista;
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

        public Inseminacion Update(Inseminacion entity, List<long> lista, List<long> listaToros, string fechaInseminacionAnterior)
        {
            connection = new SqlServerConnection();
            DbTransaction transaction = connection.BeginTransaction();
            try
            {
                if (lista == null && listaToros == null)
                {
                    var parametrosInseminacion = new Dictionary<string, object>
                    {
                        {"@fechaInsemOriginal", fechaInseminacionAnterior }
                    };
                    var delete = connection.Execute("spBorrarLogicoInseminacion", parametrosInseminacion, System.Data.CommandType.StoredProcedure, transaction);
                    if (delete == 0)
                        throw new ArgumentException("Update Inseminacion Error");
                }
                else
                {
                    var parametrosInseminacion = new Dictionary<string, object>
                    {
                        {"@fechaInsemOriginal", fechaInseminacionAnterior },
                    };
                    var update = connection.Execute("spDeleteInseminacion", parametrosInseminacion, System.Data.CommandType.StoredProcedure, transaction);
                    if (update == 0)
                        throw new ArgumentException("Update Inseminacion Error");
                    var parametros = new Dictionary<string, object>
                    {
                        {"@fechaInsemOriginal", fechaInseminacionAnterior },
                        {"@fechaInseminacion", entity.fechaInseminacion },
                        {"@idTipoInseminacion", entity.tipoInseminacion },
                        {"@idVaca", 0 }
                    };
                    for (int i = 0; i < lista.Count; i++)
                    {
                        parametros["@idVaca"] = lista.ElementAt(i);
                        update = connection.Execute("spUpdateInseminacion", parametros, System.Data.CommandType.StoredProcedure, transaction);
                        if (update == 0)
                            throw new ArgumentException("Update Inseminacion Error");
                    }
                    if (entity.tipoInseminacion == 2 && listaToros.Count() > 0)
                    {
                        var parametrosToros = new Dictionary<string, object>()
                        {
                            {"@fechaInseminacion", entity.fechaInseminacion  }
                        };
                        var delete = connection.Execute("spDeleteTorosXInseminacion", parametrosToros, System.Data.CommandType.StoredProcedure, transaction);
                        parametrosToros.Add("@idToro", 0);
                        for (int i = 0; i < listaToros.Count; i++)
                        {
                            parametrosToros["@idToro"] = listaToros.ElementAt(i);
                            update = connection.Execute("spUpdateToroXInseminacion", parametrosToros, System.Data.CommandType.StoredProcedure, transaction);
                            if (update == 0)
                                throw new ArgumentException("Update Inseminacion Error");
                        }
                    }
                    else if (listaToros == null)
                    {
                        var parametrosToros = new Dictionary<string, object>()
                        {
                            {"@fechaInseminacion", entity.fechaInseminacion  }
                        };
                        var delete = connection.Execute("spDeleteTorosXInseminacion", parametrosToros, System.Data.CommandType.StoredProcedure, transaction);
                    }
                }
                connection.Commit(transaction);
                return entity;
            }
            catch (Exception ex)
            {
                connection.Rollback(transaction);
                throw;
            }
            finally
            {
                connection.Close();
                connection = null;
                transaction = null;
            }
        }

        public void Delete(string parametro)
        {
            try
            {
                connection = new SqlServerConnection();
                long result;
                var parametros = new Dictionary<string, object>();
                if (long.TryParse(parametro, out result))
                {
                    parametros.Add("@idInseminacion", long.Parse(parametro));
                    connection.Execute("spBorrarInseminacionXId", parametros, System.Data.CommandType.StoredProcedure);
                }
                else
                {
                    parametros.Add("@fechaInseminacion", parametro);
                    connection.Execute("spBorrarInseminacionXFecha", parametros, System.Data.CommandType.StoredProcedure);
                }
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

        public IEnumerable<ReporteInseminacionHembrasServir> GetReporteHembrasServir(ReporteFilter filtro)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@codigoCampo", filtro.codigoCampo },
                    {"@periodo", filtro.periodo },
                    {"@idCategoria", filtro.idCategoria },
                    {"@idRaza", filtro.idRaza },
                    {"@idRodeo", filtro.idRodeo },
                    {"@idEstado", filtro.idEstado },
                    {"@peso", filtro.peso },
                    {"@accionPeso", (filtro.accionPeso == "0" ? null : filtro.accionPeso) },
                    {"@partos", filtro.nroPartos },
                    {"@accionNroPartos", (filtro.accionNroPartos == "0" ? null : filtro.accionNroPartos) }
                };
                if (filtro.numCaravana != 0)
                    parametros.Add("@numCaravana", filtro.numCaravana.ToString());
                var lista = connection.GetArray<ReporteInseminacionHembrasServir>("spObtenerDatosReporteInseminacionHembrasServir", parametros, System.Data.CommandType.StoredProcedure);
                return lista;
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

        public IEnumerable<ReporteInseminacionServiciosSinConfirmar> GetReporteServiciosSinConfirmar(long idCampo, string periodo)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@codigoCampo", idCampo },
                    {"@periodo", periodo }
                };
                var lista = connection.GetArray<ReporteInseminacionServiciosSinConfirmar>("spObtenerDatosReporteInseminacionServiciosSinConfirmar", parametros, System.Data.CommandType.StoredProcedure);
                return lista;
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

        public IEnumerable<ReporteInseminacionLactanciasActivas> GetReporteLactanciasActivas(long idCampo, string periodo)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@codigoCampo", idCampo },
                    {"@periodo", periodo }
                };
                var lista = connection.GetArray<ReporteInseminacionLactanciasActivas>("spObtenerDatosReporteInseminacionLactanciasActivas", parametros, System.Data.CommandType.StoredProcedure);
                return lista;
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

        public IEnumerable<ReporteInseminacionPreniadas> GetReportePreniadas(long idCampo, string periodo)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@codigoCampo", idCampo },
                    {"@periodo", periodo }
                };
                var lista = connection.GetArray<ReporteInseminacionPreniadas>("spObtenerDatosReporteInseminacionPreniadas", parametros, System.Data.CommandType.StoredProcedure);
                return lista;
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

        public Documento ReporteInseminacionHembrasServicioExportarPDF(ReporteFilter filter)
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
                string fileName = string.Format("{0}-{1}-{2}-{3}.pdf", "ReporteInseminaciones", "HembrasServicio", filter.campo, fecha);
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
                var lista = GetReporteHembrasServir(filter);
                var filtro = new BovinoManager().ObtenerDatosFiltroReporte(filter);
                Font fuente1 = new Font(FontFamily.TIMES_ROMAN, 12.0f, Font.BOLD, BaseColor.BLACK);
                Font fuente2 = new Font(FontFamily.TIMES_ROMAN, 14.0f, Font.BOLD, BaseColor.BLACK);
                Rectangle rect = PageSize.LETTER;
                List<IElement> ie;
                float pageWidth = rect.Width;
                string html = "";
                html = @"
                            <html><head></head><body>
                            <table>
                            <tr><td><b>Reporte Hembras para Servir</b></td></tr>
                            <tr><td>Campo: <b>" + filter.campo + @"</b></td></tr>
                            <tr><td>Generado por: <b>" + filter.usuario + @"</b></td></tr>
                            <tr><td>Fecha: <b>" + fecha + @"</b></td></tr>                      
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
                    string caravana, peso, accionPeso, accionNroPartos, nroPartos;
                    if (filter.numCaravana == 0) caravana = "Sin filtro";
                    else
                        caravana = filter.numCaravana.ToString();                    
                    if (filter.peso == 0) peso = "Sin filtro";
                    else
                        peso = filter.peso.ToString();
                    if (filter.accionPeso == "0") accionPeso = "Sin filtro";
                    else
                        accionPeso = (filter.accionPeso == "mayor" ? "Mayor que" : "Menor que");
                    if (filter.nroPartos == 0) nroPartos = "Sin filtro";
                    else
                        nroPartos = filter.nroPartos.ToString();
                    if (filter.accionNroPartos == "0") accionNroPartos = "Sin filtro";
                    else
                        accionNroPartos = (filter.accionNroPartos == "mayor" ? "Mayor que" : "Menor que");
                    html = @"
                            <html><head></head><body>
                            <table>
                            <tr><td><b>Filtro Aplicado</b></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>                
                            </table>
                            <table border='1'>
                            <thead>
                            <tr>
                            <th>Caravana</th>
                            <th>Categoría</th>       
                            <th>Acción Partos</th>
                            <th>Partos</th>
                            <th>Estado</th> 
                            <th>Raza</th>
                            <th>Acción Peso</th>                          
                            <th>Peso</th>";
                    html += @"</tr>               
                            </thead>
                            <tbody>
                            <tr><td>" + caravana + @"</td><td>" + (filtro.categoria == "" ? "Sin filtro" : filtro.categoria) + @"</td><td>" + accionNroPartos + @"</td><td>" + nroPartos + @"</td><td>" + (filtro.estado == "" ? "Sin filtro" : filtro.estado) + @"</td><td>" + (filtro.raza == "" ? "Sin filtro" : filtro.raza) + @"</td><td>" + accionPeso + @"</td><td>" + peso + @"</td></tr>
                            </tbody></table></body></html>";
                    ie = HTMLWorker.ParseToList(new StringReader(html), null);
                    foreach (IElement element in ie)
                    {
                        PdfPTable table = element as PdfPTable;

                        if (table != null)
                        {
                            table.SetWidthPercentage(new float[] { (float).12 * pageWidth, (float).12 * pageWidth, (float).12 * pageWidth, (float).12 * pageWidth, (float).12 * pageWidth, (float).12 * pageWidth, (float).12 * pageWidth, (float).12 * pageWidth }, rect);
                        }
                        doc.Add(element);
                    }
                    doc.Add(new Paragraph(" "));

                    html = @"
                            <html><head></head><body>
                            <table border='1'>
                            <thead>
                            <tr>
                            <th>Orden</th>
                            <th>Caravana</th>      
                            <th>Raza</th>         
                            <th>Categoría</th>          
                            <th>Edad</th>           
                            <th>Peso(Kg)</th>            
                            <th>Estado</th>             
                            <th>Partos</th>               
                            </tr>               
                            </thead>
                            <tbody>";
                    foreach (var item in lista)
                    {
                        html += @"<tr><td>" + item.nroOrden + @"</td><td>" + item.numCaravana + @"</td><td>" + item.raza + @"</td><td>" + item.categoria + @"</td><td>" + item.anos + @", " + item.meses + @"</td><td>" + item.peso + @"</td><td>" + item.estado + @"</td><td>" + item.partos + @"</td></tr>";
                    }
                    html += @"</tbody></table>
                            </body></html> ";
                    ie = HTMLWorker.ParseToList(new StringReader(html), null);
                    foreach (IElement element in ie)
                    {
                        PdfPTable table = element as PdfPTable;

                        if (table != null)
                        {
                            table.SetWidthPercentage(new float[] { (float).08 * pageWidth, (float).12 * pageWidth, (float).1 * pageWidth, (float).12 * pageWidth, (float).07 * pageWidth, (float).12 * pageWidth, (float).12 * pageWidth, (float).1 * pageWidth }, rect);
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

        public Documento ReporteInseminacionServiciosSinConfirmarExportarPDF(string campo, long codigoCampo, string periodo, string usuario)
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
                string fileName = string.Format("{0}-{1}-{2}-{3}.pdf", "ReporteInseminaciones", "ServiciosSinConfirmar", campo, fecha);
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
                var lista = GetReporteServiciosSinConfirmar(codigoCampo, periodo);
                Font fuente1 = new Font(FontFamily.TIMES_ROMAN, 12.0f, Font.BOLD, BaseColor.BLACK);
                Font fuente2 = new Font(FontFamily.TIMES_ROMAN, 14.0f, Font.BOLD, BaseColor.BLACK);
                Rectangle rect = PageSize.LETTER;
                List<IElement> ie;
                float pageWidth = rect.Width;
                string html = "";
                html = @"
                            <html><head></head><body>
                            <table>
                            <tr><td><b>Reporte Servicios sin confirmar</b></td></tr>
                            <tr><td>Campo: <b>" + campo + @"</b></td></tr>
                            <tr><td>Generado por: <b>" + usuario + @"</b></td></tr>
                            <tr><td>Fecha: <b>" + fecha + @"</b></td></tr>                          
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
                    html = @"
                            <html><head></head><body>
                            <table border='1'>
                            <thead>
                            <tr>
                            <th>Orden</th>
                            <th>Caravana</th>      
                            <th>Raza</th>         
                            <th>Categoría</th>          
                            <th>Edad</th>           
                            <th>Peso(Kg)</th>            
                            <th>Estado</th>             
                            <th>Tipo Inseminación</th>
                            <th>Fecha Inseminación</th>             
                            </tr>               
                            </thead>
                            <tbody>";
                    foreach (var item in lista)
                    {
                        html += @"<tr><td>" + item.nroOrden + @"</td><td>" + item.numCaravana + @"</td><td>" + item.raza + @"</td><td>" + item.categoria + @"</td><td>" + item.anos + @", " + item.meses + @"</td><td>" + item.peso + @"</td><td>" + item.estado + @"</td><td>" + item.tipoInseminacion + @"</td><td>" + item.fechaInseminacion + @"</td></tr>";
                    }
                    html += @"</tbody></table>
                            </body></html> ";
                    ie = HTMLWorker.ParseToList(new StringReader(html), null);
                    foreach (IElement element in ie)
                    {
                        PdfPTable table = element as PdfPTable;

                        if (table != null)
                        {
                            table.SetWidthPercentage(new float[] { (float).08 * pageWidth, (float).12 * pageWidth, (float).1 * pageWidth, (float).12 * pageWidth, (float).07 * pageWidth, (float).12 * pageWidth, (float).12 * pageWidth, (float).1 * pageWidth, (float).1 * pageWidth }, rect);
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

        public Documento ReporteInseminacionLactanciasExportarPDF(string campo, long codigoCampo, string periodo, string usuario)
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
                string fileName = string.Format("{0}-{1}-{2}-{3}.pdf", "ReporteInseminaciones", "LactanciasActivas", campo, fecha);
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
                var lista = GetReporteLactanciasActivas(codigoCampo, periodo);
                Font fuente1 = new Font(FontFamily.TIMES_ROMAN, 12.0f, Font.BOLD, BaseColor.BLACK);
                Font fuente2 = new Font(FontFamily.TIMES_ROMAN, 14.0f, Font.BOLD, BaseColor.BLACK);
                Rectangle rect = PageSize.LETTER;
                List<IElement> ie;
                float pageWidth = rect.Width;
                string html = "";
                html = @"
                            <html><head></head><body>
                            <table>
                            <tr><td><b>Reporte Lactancias Activas</b></td></tr>
                            <tr><td>Campo: <b>" + campo + @"</b></td></tr>
                            <tr><td>Generado por: <b>" + usuario + @"</b></td></tr>
                            <tr><td>Fecha: <b>" + fecha + @"</b></td></tr>                          
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
                    html = @"
                            <html><head></head><body>
                            <table border='1'>
                            <thead>
                            <tr>
                            <th>Orden</th>
                            <th>Caravana</th>      
                            <th>Raza</th>         
                            <th>Categoría</th>          
                            <th>Edad</th>           
                            <th>Peso(Kg)</th>            
                            <th>Partos</th>             
                            <th>Alimentación</th>
                            <th>Fecha últ. Parto</th>             
                            </tr>               
                            </thead>
                            <tbody>";
                    foreach (var item in lista)
                    {
                        html += @"<tr><td>" + item.nroOrden + @"</td><td>" + item.numCaravana + @"</td><td>" + item.raza + @"</td><td>" + item.categoria + @"</td><td>" + item.anos + @", " + item.meses + @"</td><td>" + item.peso + @"</td><td>" + item.partos + @"</td><td>" + item.alimento + @"</td><td>" + item.fechaUltimoParto + @"</td></tr>";
                    }
                    html += @"</tbody></table>
                            </body></html> ";
                    ie = HTMLWorker.ParseToList(new StringReader(html), null);
                    foreach (IElement element in ie)
                    {
                        PdfPTable table = element as PdfPTable;

                        if (table != null)
                        {
                            table.SetWidthPercentage(new float[] { (float).08 * pageWidth, (float).12 * pageWidth, (float).12 * pageWidth, (float).12 * pageWidth, (float).07 * pageWidth, (float).12 * pageWidth, (float).08 * pageWidth, (float).15 * pageWidth, (float).15 * pageWidth }, rect);
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

        public Documento ReporteInseminacionPreniadasExportarPDF(string campo, long codigoCampo, string periodo, string usuario)
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
                string fileName = string.Format("{0}-{1}-{2}-{3}.pdf", "ReporteInseminaciones", "Preñadas", campo, fecha);
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
                var lista = GetReportePreniadas(codigoCampo, periodo);
                Font fuente1 = new Font(FontFamily.TIMES_ROMAN, 12.0f, Font.BOLD, BaseColor.BLACK);
                Font fuente2 = new Font(FontFamily.TIMES_ROMAN, 14.0f, Font.BOLD, BaseColor.BLACK);
                Rectangle rect = PageSize.LETTER;
                List<IElement> ie;
                float pageWidth = rect.Width;
                string html = "";
                html = @"
                            <html><head></head><body>
                            <table>
                            <tr><td><b>Reporte Vacas Preñadas</b></td></tr>
                            <tr><td>Campo: <b>" + campo + @"</b></td></tr>
                            <tr><td>Generado por: <b>" + usuario + @"</b></td></tr>
                            <tr><td>Fecha: <b>" + fecha + @"</b></td></tr>                          
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
                    html = @"
                            <html><head></head><body>
                            <table border='1'>
                            <thead>
                            <tr>
                            <th>Orden</th>
                            <th>Caravana</th>      
                            <th>Raza</th>         
                            <th>Categoría</th>          
                            <th>Edad</th>           
                            <th>Peso(Kg)</th>            
                            <th>Tipo Inseminación</th>
                            <th>Fecha Parto</th>             
                            </tr>               
                            </thead>
                            <tbody>";
                    foreach (var item in lista)
                    {
                        html += @"<tr><td>" + item.nroOrden + @"</td><td>" + item.numCaravana + @"</td><td>" + item.raza + @"</td><td>" + item.categoria + @"</td><td>" + item.anos + @", " + item.meses + @"</td><td>" + item.peso + @"</td><td>" + item.tipoInseminacion + @"</td><td>" + item.fechaParto + @"</td></tr>";
                    }
                    html += @"</tbody></table>
                            </body></html> ";
                    ie = HTMLWorker.ParseToList(new StringReader(html), null);
                    foreach (IElement element in ie)
                    {
                        PdfPTable table = element as PdfPTable;

                        if (table != null)
                        {
                            table.SetWidthPercentage(new float[] { (float).08 * pageWidth, (float).12 * pageWidth, (float).12 * pageWidth, (float).12 * pageWidth, (float).07 * pageWidth, (float).12 * pageWidth, (float).15 * pageWidth, (float).15 * pageWidth }, rect);
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

        public Documento ReporteInseminacionHembrasServicioExportarExcel(ReporteFilter filter)
        {
            SLExcelData data = new SLExcelData();
            try
            {
                var filtro = new BovinoManager().ObtenerDatosFiltroReporte(filter);
                data.HeadersFiltro = new List<string>();
                data.HeadersFiltro.Add("Caravana");
                data.HeadersFiltro.Add("Categoría");
                data.HeadersFiltro.Add("Acción Partos");
                data.HeadersFiltro.Add("Nro. Partos");
                data.HeadersFiltro.Add("Estado");
                data.HeadersFiltro.Add("Raza");
                data.HeadersFiltro.Add("Acción Peso");
                data.HeadersFiltro.Add("Peso");                

                List<string> rowFiltro = new List<string>();
                if (filter.numCaravana != 0)
                    rowFiltro.Add(filter.numCaravana.ToString());
                else
                    rowFiltro.Add("Sin datos");
                if (filtro.categoria != "") rowFiltro.Add(filtro.categoria);
                else rowFiltro.Add("Sin datos");
                if (filter.accionNroPartos == "mayor")
                    rowFiltro.Add("Mayor que");
                else if (filter.accionNroPartos == "menor")
                    rowFiltro.Add("Menor que");
                else
                    rowFiltro.Add("Sin datos");
                if (filter.nroPartos != 0)
                    rowFiltro.Add(filter.nroPartos.ToString());
                else
                    rowFiltro.Add("Sin datos");
                if (filtro.estado != "") rowFiltro.Add(filtro.estado);
                else rowFiltro.Add("Sin datos");
                if (filtro.raza != "") rowFiltro.Add(filtro.raza);
                else rowFiltro.Add("Sin datos");
                if (filter.accionPeso == "mayor")
                    rowFiltro.Add("Mayor que");
                else if (filter.accionPeso == "menor")
                    rowFiltro.Add("Menor que");
                else
                    rowFiltro.Add("Sin datos");
                if (filter.peso != 0)
                    rowFiltro.Add(filter.peso.ToString());
                else
                    rowFiltro.Add("Sin datos");                
                data.DataRowsFiltro = new List<List<string>>();
                data.DataRowsFiltro.Add(rowFiltro);

                var lista = GetReporteHembrasServir(filter);
                data.Headers.Add("Orden");
                data.Headers.Add("Caravana");
                data.Headers.Add("Raza");
                data.Headers.Add("Categoría");
                data.Headers.Add("Edad");
                data.Headers.Add("Peso (Kg)");
                data.Headers.Add("Estado");
                data.Headers.Add("Partos");
                foreach (var item in lista)
                {
                    List<string> row = new List<string>() {
                        item.nroOrden.ToString(),
                        item.numCaravana.ToString(),
                        item.raza,
                        item.categoria,
                        item.anos + ", " + item.meses,
                        item.peso.ToString(),
                        item.estado,
                        item.partos.ToString()
                    };
                    data.DataRows.Add(row);
                }
                var archivo = StaticFunctions.GenerateExcel(data, filter.campo, "ReportesInseminacion-HembrasServicio", filter.usuario);
                return new Documento() { nombre = archivo };
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {

            }
        }

        public Documento ReporteInseminacionServiciosSinConfirmarExportarExcel(string campo, long codigoCampo, string periodo, string usuario)
        {
            SLExcelData data = new SLExcelData();
            try
            {
                var lista = GetReporteServiciosSinConfirmar(codigoCampo, periodo);
                data.Headers.Add("Orden");
                data.Headers.Add("Caravana");
                data.Headers.Add("Raza");
                data.Headers.Add("Categoría");
                data.Headers.Add("Edad");
                data.Headers.Add("Peso (Kg)");
                data.Headers.Add("Estado");
                data.Headers.Add("Tipo Inseminación");
                data.Headers.Add("Fecha Inseminación");
                foreach (var item in lista)
                {
                    List<string> row = new List<string>() {
                        item.nroOrden.ToString(),
                        item.numCaravana.ToString(),
                        item.raza,
                        item.categoria,
                        item.anos + "," + item.meses,
                        item.peso.ToString(),
                        item.estado,
                        item.tipoInseminacion,
                        item.fechaInseminacion
                    };
                    data.DataRows.Add(row);
                }
                var archivo = StaticFunctions.GenerateExcel(data, campo, "ReportesInseminacion-ServiciosSinConfirmar", usuario);
                return new Documento() { nombre = archivo };
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {

            }
        }

        public Documento ReporteInseminacionLactanciasExportarExcel(string campo, long codigoCampo, string periodo, string usuario)
        {
            SLExcelData data = new SLExcelData();
            try
            {
                var lista = GetReporteLactanciasActivas(codigoCampo, periodo);
                data.Headers.Add("Orden");
                data.Headers.Add("Caravana");
                data.Headers.Add("Raza");
                data.Headers.Add("Categoría");
                data.Headers.Add("Edad");
                data.Headers.Add("Peso (Kg)");
                data.Headers.Add("Partos");
                data.Headers.Add("Alimentación");
                data.Headers.Add("Fecha últ. parto");
                foreach (var item in lista)
                {
                    List<string> row = new List<string>() {
                        item.nroOrden.ToString(),
                        item.numCaravana.ToString(),
                        item.raza,
                        item.categoria,
                        item.anos + ", " + item.meses,
                        item.peso.ToString(),
                        item.partos.ToString(),
                        item.alimento,
                        item.fechaUltimoParto
                    };
                    data.DataRows.Add(row);
                }
                var archivo = StaticFunctions.GenerateExcel(data, campo, "ReportesInseminacion-LactanciasActivas", usuario);
                return new Documento() { nombre = archivo };
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {

            }
        }

        public Documento ReporteInseminacionPreniadasExportarExcel(string campo, long codigoCampo, string periodo, string usuario)
        {
            SLExcelData data = new SLExcelData();
            try
            {
                var lista = GetReportePreniadas(codigoCampo, periodo);
                data.Headers.Add("Orden");
                data.Headers.Add("Caravana");
                data.Headers.Add("Raza");
                data.Headers.Add("Categoría");
                data.Headers.Add("Edad");
                data.Headers.Add("Peso (Kg)");
                data.Headers.Add("Tipo Inseminación");
                data.Headers.Add("Fecha parto");
                foreach (var item in lista)
                {
                    List<string> row = new List<string>() {
                        item.nroOrden.ToString(),
                        item.numCaravana.ToString(),
                        item.raza,
                        item.categoria,
                        item.anos + "," + item.meses,
                        item.peso.ToString(),
                        item.tipoInseminacion,
                        item.fechaParto
                    };
                    data.DataRows.Add(row);
                }
                var archivo = StaticFunctions.GenerateExcel(data, campo, "ReportesInseminacion-Preñadas", usuario);
                return new Documento() { nombre = archivo };
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {

            }
        }

        public Documento ServiciosSinConfimarExportarPDF(string campo, long codigoCampo, long rango, string usuario)
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
                string fileName = string.Format("{0}-{1}-{2}.pdf", "ServiciosSinConfirmar", campo, fecha);
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
                var lista = GetInseminacionesXFechaInsem(codigoCampo);
                List<ServSinConfirmar> aux = new List<ServSinConfirmar>();
                DateTime fechaInseminacion, fechaHoy = DateTime.Now;
                for (int i = 0; i < lista.Count(); i++)
                {
                    fechaInseminacion = new DateTime(int.Parse(lista.ElementAt(i).fechaInseminacion.Split('/')[2]), int.Parse(lista.ElementAt(i).fechaInseminacion.Split('/')[1]), int.Parse(lista.ElementAt(i).fechaInseminacion.Split('/')[0]));
                    if (((fechaHoy - fechaInseminacion).Days < rango && rango == 60) ||
                        ((fechaHoy - fechaInseminacion).Days < 90 && (fechaHoy - fechaInseminacion).Days >= 60 && rango == 6090) ||
                        ((fechaHoy - fechaInseminacion).Days > rango && rango == 90))
                        aux.Add(lista.ElementAt(i));
                }
                Font fuente1 = new Font(FontFamily.TIMES_ROMAN, 12.0f, Font.BOLD, BaseColor.BLACK);
                Font fuente2 = new Font(FontFamily.TIMES_ROMAN, 14.0f, Font.BOLD, BaseColor.BLACK);
                Rectangle rect = PageSize.LETTER;
                List<IElement> ie;
                float pageWidth = rect.Width;
                string html = "";
                html = @"
                            <html><head></head><body>
                            <table>
                            <tr><td><b>Servicios sin Confirmar</b></td></tr>
                            <tr><td>Campo: <b>" + campo + @"</b></td></tr>
                            <tr><td>Generado por: <b>" + usuario + @"</b></td></tr>
                            <tr><td>Fecha: <b>" + fecha + @"</b></td></tr>                   
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
                    html = @"
                            <html><head></head><body>
                            <table border='1'>
                            <thead>
                            <tr>
                            <th>Tipo Inseminación</th>   
                            <th>Fecha Inseminación</th>        
                            <th>Cant. vacas que participaron</th>         
                            <th>Cant. toros que participaron</th>              
                            </tr>               
                            </thead>
                            <tbody>";
                    foreach (var item in aux)
                    {
                        html += @"<tr><td>" + item.tipoInseminacion + @"</td><td>" + item.fechaInseminacion + @"</td><td>" + item.cantidadVacas + @"</td><td>" + item.cantidadToros + @"</td></tr>";
                    }
                    html += @"</tbody></table>
                            </body></html> ";
                    ie = HTMLWorker.ParseToList(new StringReader(html), null);
                    foreach (IElement element in ie)
                    {
                        PdfPTable table = element as PdfPTable;

                        if (table != null)
                        {
                            table.SetWidthPercentage(new float[] { (float).23 * pageWidth, (float).23 * pageWidth, (float).23 * pageWidth, (float).23 * pageWidth }, rect);
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

        public Documento PreniadasExportarPDF(string campo, long codigoCampo, string periodo, long rango, string usuario)
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
                string fileName = string.Format("{0}-{1}-{2}.pdf", "Preñadas", campo, fecha);
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
                var lista = GetPreniadasPorParir(codigoCampo, periodo);
                List<PreniadasXParir> aux = new List<PreniadasXParir>();
                DateTime fechaParto, fechaHoy = DateTime.Now;
                for (int i = 0; i < lista.Count(); i++)
                {
                    fechaParto = new DateTime(int.Parse(lista.ElementAt(i).fechaEstimadaParto.Split('/')[2]), int.Parse(lista.ElementAt(i).fechaEstimadaParto.Split('/')[1]), int.Parse(lista.ElementAt(i).fechaEstimadaParto.Split('/')[0]));
                    if (((fechaParto - fechaHoy).Days < rango && rango == 10) ||
                        ((fechaParto - fechaHoy).Days < 30 && (fechaParto - fechaHoy).Days >= 10 && rango == 1030) ||
                        ((fechaParto - fechaHoy).Days < 60 && (fechaParto - fechaHoy).Days >= 30 && rango == 3060))
                        aux.Add(lista.ElementAt(i));
                }
                Font fuente1 = new Font(FontFamily.TIMES_ROMAN, 12.0f, Font.BOLD, BaseColor.BLACK);
                Font fuente2 = new Font(FontFamily.TIMES_ROMAN, 14.0f, Font.BOLD, BaseColor.BLACK);
                Rectangle rect = PageSize.LETTER;
                List<IElement> ie;
                float pageWidth = rect.Width;
                string html = "";
                html = @"
                            <html><head></head><body>
                            <table>
                            <tr><td><b>Vacas Preñadas</b></td></tr>
                            <tr><td>Campo: <b>" + campo + @"</b></td></tr>
                            <tr><td>Generado por: <b>" + usuario + @"</b></td></tr>
                            <tr><td>Fecha: <b>" + fecha + @"</b></td></tr>                    
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
                    html = @"
                            <html><head></head><body>
                            <table border='1'>
                            <thead>
                            <tr>
                            <th>Tipo Inseminación</th>   
                            <th>Fecha Inseminación</th>        
                            <th>Fecha estimada Parto</th>                      
                            </tr>               
                            </thead>
                            <tbody>";
                    foreach (var item in aux)
                    {
                        html += @"<tr><td>" + item.tipoInseminacion + @"</td><td>" + item.fechaInseminacion + @"</td><td>" + item.fechaEstimadaParto + @"</td></tr>";
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

        public Documento ServiciosSinConfimarExportarExcel(string campo, long codigoCampo, long rango, string usuario)
        {
            SLExcelData data = new SLExcelData();
            try
            {                
                var lista = GetInseminacionesXFechaInsem(codigoCampo);
                List<ServSinConfirmar> aux = new List<ServSinConfirmar>();
                DateTime fechaInseminacion, fechaHoy = DateTime.Now;
                for (int i = 0; i < lista.Count(); i++)
                {
                    fechaInseminacion = new DateTime(int.Parse(lista.ElementAt(i).fechaInseminacion.Split('/')[2]), int.Parse(lista.ElementAt(i).fechaInseminacion.Split('/')[1]), int.Parse(lista.ElementAt(i).fechaInseminacion.Split('/')[0]));
                    if (((fechaHoy - fechaInseminacion).Days < rango && rango == 60) ||
                        ((fechaHoy - fechaInseminacion).Days < 90 && (fechaHoy - fechaInseminacion).Days >= 60 && rango == 6090) ||
                        ((fechaHoy - fechaInseminacion).Days > rango && rango == 90))
                        aux.Add(lista.ElementAt(i));
                }
                data.Headers.Add("Tipo Inseminación");
                data.Headers.Add("Fecha Inseminación");
                data.Headers.Add("Cant. vacas que participaron");
                data.Headers.Add("Cant. de toros que participaron");

                foreach (var item in aux)
                {
                    List<string> row = new List<string>()
                    {
                        item.tipoInseminacion,
                        item.fechaInseminacion,
                        item.cantidadVacas.ToString(),
                        item.cantidadToros.ToString()
                    };
                    data.DataRows.Add(row);
                }
                var archivo = StaticFunctions.GenerateExcel(data, "ServiciosSinConfirmar", campo, usuario);
                return new Documento() { nombre = archivo };
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {

            }
        }

        public Documento PreniadasExportarExcel(string campo, long codigoCampo, string periodo, long rango, string usuario)
        {
            SLExcelData data = new SLExcelData();
            try
            {
                var lista = GetPreniadasPorParir(codigoCampo, periodo);
                List<PreniadasXParir> aux = new List<PreniadasXParir>();
                DateTime fechaParto, fechaHoy = DateTime.Now;
                for (int i = 0; i < lista.Count(); i++)
                {
                    fechaParto = new DateTime(int.Parse(lista.ElementAt(i).fechaEstimadaParto.Split('/')[2]), int.Parse(lista.ElementAt(i).fechaEstimadaParto.Split('/')[1]), int.Parse(lista.ElementAt(i).fechaEstimadaParto.Split('/')[0]));
                    if (((fechaParto - fechaHoy).Days < rango && rango == 10) ||
                        ((fechaParto - fechaHoy).Days < 30 && (fechaParto - fechaHoy).Days >= 10 && rango == 1030) ||
                        ((fechaParto - fechaHoy).Days < 60 && (fechaParto - fechaHoy).Days >= 30 && rango == 3060))
                        aux.Add(lista.ElementAt(i));
                }
                data.Headers.Add("Tipo Inseminación");
                data.Headers.Add("Fecha Inseminación");
                data.Headers.Add("Fecha Parto");

                foreach (var item in aux)
                {
                    List<string> row = new List<string>()
                    {
                        item.tipoInseminacion,
                        item.fechaInseminacion,
                        item.fechaEstimadaParto.ToString()
                    };
                    data.DataRows.Add(row);
                }
                var archivo = StaticFunctions.GenerateExcel(data, "Preñadas", campo, usuario);
                return new Documento() { nombre = archivo };
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {

            }
        }
    }
}
