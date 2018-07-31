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
    public class EventoManager : IManager<Evento>
    {
        private SqlServerConnection connection;
        public Evento Create(Evento entity)
        {
            throw new NotImplementedException();
        }

        public void Delete(long id)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@idEvento", id }
                };
                var delete = connection.Execute("spEliminarEvento", parametros, System.Data.CommandType.StoredProcedure);
                if (delete == 0)
                    throw new ArgumentException("Delete Evento Error");
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

        public IEnumerable<Evento> Get(Evento entity)
        {
            throw new NotImplementedException();
        }

        public Evento Get(long id)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@idEvento", id }
                };
                var evento = connection.GetArray<Evento>("spObtenerDatosEvento", parametros, System.Data.CommandType.StoredProcedure).FirstOrDefault();
                return evento;
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

        public Evento GetFilter()
        {
            throw new NotImplementedException();
        }

        public Evento Update(long id, Evento entity)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<EventosItem> GetList(EventoFilter filter)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@idTipoEvento", filter.idTipoEvento },
                    {"@fechaDesde", filter.fechaDesde },
                    {"@fechaHasta", filter.fechaHasta },
                    {"@idCampo", filter.codigoCampo },
                    {"@periodo", filter.periodo }
                };
                if (filter.numCaravana != 0)
                    parametros.Add("@numCaravana", filter.numCaravana);
                var lista = connection.GetArray<EventosItem>("spObtenerListaEventos", parametros, System.Data.CommandType.StoredProcedure);
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

        public Evento Insert(Evento evento, List<long> lista)
        {
            connection = new SqlServerConnection();
            DbTransaction transaction = connection.BeginTransaction();
            try
            {
                var parametrosEvento = new Dictionary<string, object>
                {
                    {"@cant", evento.cantidad },
                    {"@idTipoEvento", evento.idTipoEvento },
                    {"@fechaHora", evento.fechaHora }
                };
                switch (evento.idTipoEvento)
                {
                    case 1: //vacunacion
                        parametrosEvento.Add("@idVacuna", evento.idVacuna);
                        break;
                    case 2: //antibiotico
                        parametrosEvento.Add("@idAntibiotico", evento.idAntibiotico);
                        break;
                    case 3: //manejo
                        parametrosEvento.Add("@codigoCampo", evento.idCampoDestino);
                        parametrosEvento.Add("@idRodeoDestino", evento.idRodeoDestino);
                        break;
                    case 4: //alimenticio
                        parametrosEvento.Add("@idAlimento", evento.idAlimento);
                        break;
                }
                evento.idEvento = connection.Execute("spRegistrarEvento", parametrosEvento, System.Data.CommandType.StoredProcedure, transaction);
                if (evento.idEvento == 0)
                    throw new ArgumentException("Create Evento Error");
                var parametrosDetalle = new Dictionary<string, object>()
                {
                    {"@idEvento", evento.idEvento },
                    {"@idTipoEvento", evento.idTipoEvento },
                    {"@fechaHora", evento.fechaHora }
                };
                switch (evento.idTipoEvento)
                {
                    case 1: //vacunacion
                        parametrosDetalle.Add("@idVacuna", evento.idVacuna);
                        break;
                    case 3: //manejo
                        parametrosDetalle.Add("@idRodeoDestino", evento.idRodeoDestino);
                        break;
                    case 4: //alimenticio
                        parametrosDetalle.Add("@idAlimento", evento.idAlimento);
                        break;
                }
                var insert = 0;
                parametrosDetalle.Add("@idBovino", 0);
                for (int i = 0; i < lista.Count; i++)
                {
                    parametrosDetalle["@idBovino"] = lista.ElementAt(i);
                    insert = connection.Execute("spRegistrarEventosXBovino", parametrosDetalle, System.Data.CommandType.StoredProcedure, transaction);
                    if (insert == 0)
                        throw new ArgumentException("Create EventosXBovino Error");
                }
                //if (evento.idTipoEvento == 3)
                //{
                //    insert = 0;
                //    var parametros = new Dictionary<string, object>
                //    {
                //        {"@idRodeo", evento.idRodeoDestino },
                //        {"@idBovino", 0 }
                //    };
                //    for (int i = 0; i < lista.Count; i++)
                //    {
                //        parametros["@idBovino"] = lista.ElementAt(i);
                //        insert = connection.Execute("spActualizarRodeoBovino", parametros, System.Data.CommandType.StoredProcedure, transaction);
                //        if (insert == 0)
                //            throw new ArgumentException("Update rodeo bovino Error");
                //    }
                //}
                connection.Commit(transaction);
                return evento;
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

        public EventoDetalle GetEvento(long id)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@idEvento", id }
                };
                var evento = connection.GetArray<EventoDetalle>("spGetEvento", parametros, System.Data.CommandType.StoredProcedure).FirstOrDefault();
                evento.listaBovinos = connection.GetArray<BovinoItem>("spObtenerEventosXBovino", parametros, System.Data.CommandType.StoredProcedure).ToList();
                return evento;
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

        public Evento Update(long id, Evento entity, List<long> lista)
        {
            connection = new SqlServerConnection();
            DbTransaction transaction = connection.BeginTransaction();
            try
            {
                if (lista == null)
                {
                    var param = new Dictionary<string, object>
                    {
                        {"@idEvento", id }
                    };
                    connection.Execute("spDeleteDetalleXBovino", param, System.Data.CommandType.StoredProcedure, transaction);
                    var delete = connection.Execute("spEliminarEvento", param, System.Data.CommandType.StoredProcedure, transaction);
                    if (delete == 0)
                        throw new ArgumentException("Delete Evento Error");
                }
                else
                {
                    var parametrosEvento = new Dictionary<string, object>
                    {
                        {"@idEvento", id },
                        {"@idTipoEvento", entity.idTipoEvento },
                        {"@fechaHora", entity.fechaHora },
                        {"@cantidad", entity.cantidad }
                    };
                    switch (entity.idTipoEvento)
                    {
                        case 1:
                            parametrosEvento.Add("@idVacuna", entity.idVacuna);
                            break;
                        case 2:
                            parametrosEvento.Add("@idAntibiotico", entity.idAntibiotico);
                            break;
                        case 3:
                            parametrosEvento.Add("@idCampoDestino", entity.idCampoDestino);
                            parametrosEvento.Add("@idRodeoDestino", entity.idRodeoDestino);
                            break;
                        case 4:
                            parametrosEvento.Add("@idAlimento", entity.idAlimento);
                            break;
                    }
                    var update = connection.Execute("spModificarEvento", parametrosEvento, System.Data.CommandType.StoredProcedure, transaction);
                    if (update == 0)
                        throw new ArgumentException("Update evento error");
                    var parametrosDetalle = new Dictionary<string, object>
                    {
                        {"@idEvento", id }
                    };
                    connection.Execute("spDeleteDetalleXBovino", parametrosDetalle, System.Data.CommandType.StoredProcedure, transaction);
                    var insertDetalle = 0;
                    var fechaHora = DateTime.Now.ToString("yyyyMMddHHmmss");
                    parametrosDetalle.Add("@idBovino", 0);
                    parametrosDetalle.Add("@fechaHora", fechaHora);
                    parametrosDetalle.Add("@idTipoEvento", entity.idTipoEvento);
                    switch (entity.idTipoEvento)
                    {
                        case 1:
                            parametrosDetalle.Add("@idVacuna", entity.idVacuna);
                            break;
                        case 3:
                            parametrosDetalle.Add("@idRodeoDestino", entity.idRodeoDestino);
                            break;
                        case 4:
                            parametrosDetalle.Add("@idAlimento", entity.idAlimento);
                            parametrosDetalle.Add("@cantAlimento", entity.cantidad);
                            break;
                    }
                    for (int i = 0; i < lista.Count; i++)
                    {
                        parametrosDetalle["@idBovino"] = lista.ElementAt(i);
                        insertDetalle = connection.Execute("spRegistrarEventosXBovino", parametrosDetalle, System.Data.CommandType.StoredProcedure, transaction);
                        if (insertDetalle == 0)
                            throw new ArgumentException("Update EventosXBovino Error");
                    }
                    //if (entity.idTipoEvento == 3)
                    //{
                    //    var insert = 0;
                    //    var parametros = new Dictionary<string, object>
                    //    {
                    //        {"@idRodeo", entity.idRodeoDestino },
                    //        {"@idBovino", 0 }
                    //    };
                    //    for (int i = 0; i < lista.Count; i++)
                    //    {
                    //        parametros["@idBovino"] = lista.ElementAt(i);
                    //        insert = connection.Execute("spActualizarRodeoBovino", parametros, System.Data.CommandType.StoredProcedure, transaction);
                    //        if (insert == 0)
                    //            throw new ArgumentException("Update rodeo bovino Error");
                    //    }
                    //}
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

        public IEnumerable<ReporteEventos> GetReporte(ReporteFilter filter)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@idTipoEvento", filter.idTipoEvento },
                    {"@fechaDesde", filter.fechaDesde },
                    {"@fechaHasta", filter.fechaHasta },
                    {"@codigoCampo", filter.codigoCampo },
                    {"@periodo", filter.periodo }
                };
                if (filter.numCaravana != 0)
                    parametros.Add("@numCaravana", filter.numCaravana);
                var lista = connection.GetArray<ReporteEventos>("spObtenerDatosReporteEventos", parametros, System.Data.CommandType.StoredProcedure);
                DateTime fechaAnterior, fechaSiguiente;
                for (int i = 0; i < lista.Count(); i++)
                {
                    parametros = new Dictionary<string, object>()
                    {
                        {"@idEvento", lista.ElementAt(i).idEvento }
                    };
                    var caravanas = connection.GetArray<Caravana>("spGetBovinosXEvento", parametros, System.Data.CommandType.StoredProcedure).Select(x => Convert.ToString(x.caravana.ToString())).ToArray();
                    lista.ElementAt(i).caravanas = string.Join(", ", caravanas);
                    if (lista.ElementAt(i).tipoEvento != "Vacunación")
                    {
                        for (int j = i + 1; j < lista.Count(); j++)
                        {
                            if (lista.ElementAt(j).tipoEvento == lista.ElementAt(i).tipoEvento)
                            {
                                fechaSiguiente = new DateTime(int.Parse(lista.ElementAt(i).fechaHora.Split('/')[2].Substring(0, 4)), int.Parse(lista.ElementAt(i).fechaHora.Split('/')[1]), int.Parse(lista.ElementAt(i).fechaHora.Split('/')[0]));
                                fechaAnterior = new DateTime(int.Parse(lista.ElementAt(j).fechaHora.Split('/')[2].Substring(0, 4)), int.Parse(lista.ElementAt(j).fechaHora.Split('/')[1]), int.Parse(lista.ElementAt(j).fechaHora.Split('/')[0]));
                                lista.ElementAt(i).duracion = (fechaSiguiente - fechaAnterior).Days;
                                break;
                            }
                        }
                    }
                    else
                        lista.ElementAt(i).duracion = 1;
                }
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

        public Documento ReporteEventosExportarPDF(ReporteFilter filter)
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

                var fecha = DateTime.Now.ToString("dd-MM-yyyyHHmm");
                // Nombre del archivo
                string fileName = string.Format("{0}-{1}-{2}.pdf", "ReporteEventos", filter.campo, fecha);
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
                var lista = GetReporte(filter);
                Font fuente1 = new Font(FontFamily.TIMES_ROMAN, 12.0f, Font.BOLD, BaseColor.BLACK);
                Font fuente2 = new Font(FontFamily.TIMES_ROMAN, 14.0f, Font.BOLD, BaseColor.BLACK);
                Rectangle rect = PageSize.LETTER;
                List<IElement> ie;
                float pageWidth = rect.Width;
                fecha = DateTime.Now.ToString("dd-MM-yyyy HH:mm");
                string html = "";
                html = @"
                            <html><head></head><body>
                            <table>
                            <tr><td><b>Reporte Eventos</b></td></tr>
                            <tr><td>Campo: <b>" + filter.campo + @"</b></td></tr>
                            <tr><td>Generado por: <b>" + filter.usuario + @"</b></td></tr>
                            <tr><td>Fecha: <b>" + fecha + @"</b></td></tr>
                            <tr><td>Período: <b>" + filter.periodo + @"</b></td></tr>                         
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
                    string caravana, tipoEvento;
                    if (filter.numCaravana == 0) caravana = "Sin filtro";
                    else
                        caravana = filter.numCaravana.ToString();
                    switch (filter.idTipoEvento)
                    {
                        case 1:
                            tipoEvento = "Vacunación";
                            break;
                        case 2:
                            tipoEvento = "Antibiótico";
                            break;
                        case 3:
                            tipoEvento = "Manejo";
                            break;
                        case 4:
                            tipoEvento = "Alimenticio";
                            break;
                        default:
                            tipoEvento = "Sin filtro";
                            break;
                    }
                    html = @"
                            <html><head></head><body>
                            <table>
                            <tr><td><b>Filtro Aplicado</b></td><td></td><td></td><td></td></tr>                
                            </table>
                            <table border='1'>
                            <thead>
                            <tr>
                            <th>Caravana</th>
                            <th>Tipo Evento</th>       
                            <th>Fecha desde</th>    
                            <th>Fecha hasta</th>";
                    html += @"</tr>               
                            </thead>
                            <tbody>
                            <tr><td>" + caravana + @"</td><td>" + tipoEvento + @"</td><td>" + (filter.fechaDesde == null ? "Sin filtro" : filter.fechaDesde) + @"</td><td>" + (filter.fechaHasta == null ? "Sin filtro" : filter.fechaHasta) + @"</td></tr>
                            </tbody></table></body></html>";
                    ie = HTMLWorker.ParseToList(new StringReader(html), null);
                    foreach (IElement element in ie)
                    {
                        PdfPTable table = element as PdfPTable;

                        if (table != null)
                        {
                            table.SetWidthPercentage(new float[] { (float).25 * pageWidth, (float).25 * pageWidth, (float).25 * pageWidth, (float).25 * pageWidth }, rect);
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
                            <th>Tipo Evento</th>       
                            <th>Fecha</th>        
                            <th>Duración (Días)</th>         
                            <th>Descripción</th>          
                            <th>Caravanas que participaron</th>               
                            </tr>               
                            </thead>
                            <tbody>";
                    foreach (var item in lista)
                    {
                        html += @"<tr><td>" + item.nroOrden + @"</td><td>" + item.tipoEvento + @"</td><td>" + item.fechaHora + @"</td><td>" + item.duracion + @"</td><td>" + item.descripcion + @"</td><td>" + item.caravanas + @"</td></tr>";
                    }
                    html += @"</tbody></table>
                            </body></html> ";
                    ie = HTMLWorker.ParseToList(new StringReader(html), null);
                    foreach (IElement element in ie)
                    {
                        PdfPTable table = element as PdfPTable;

                        if (table != null)
                        {
                            table.SetWidthPercentage(new float[] { (float).08 * pageWidth, (float).15 * pageWidth, (float).2 * pageWidth, (float).12 * pageWidth, (float).2 * pageWidth, (float).15 * pageWidth }, rect);
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

        public Documento ReporteEventosExportarExcel(ReporteFilter filter)
        {
            SLExcelData data = new SLExcelData();
            try
            {
                data.HeadersFiltro = new List<string>();
                data.HeadersFiltro.Add("Caravana");
                data.HeadersFiltro.Add("Tipo Evento");
                data.HeadersFiltro.Add("Fecha Desde");
                data.HeadersFiltro.Add("Fecha Hasta");

                List<string> rowFiltro = new List<string>();
                if (filter.numCaravana != 0)
                    rowFiltro.Add(filter.numCaravana.ToString());
                else
                    rowFiltro.Add("Sin datos");
                switch (filter.idTipoEvento)
                {
                    case 1:
                        rowFiltro.Add("Vacunación");
                        break;
                    case 2:
                        rowFiltro.Add("Antibiótico");
                        break;
                    case 3:
                        rowFiltro.Add("Manejo");
                        break;
                    case 4:
                        rowFiltro.Add("Alimenticio");
                        break;
                    default:
                        rowFiltro.Add("Sin filtro");
                        break;
                }
                if (filter.fechaDesde != null) rowFiltro.Add(filter.fechaDesde);
                else rowFiltro.Add("Sin datos");
                if (filter.fechaHasta != null) rowFiltro.Add(filter.fechaHasta);
                else rowFiltro.Add("Sin datos");
                data.DataRowsFiltro = new List<List<string>>();
                data.DataRowsFiltro.Add(rowFiltro);

                var lista = GetReporte(filter);
                data.Headers.Add("Orden");
                data.Headers.Add("Tipo Evento");
                data.Headers.Add("Fecha");
                data.Headers.Add("Duración (Días)");
                data.Headers.Add("Descripción");
                data.Headers.Add("Caravana de animales que participaron");

                foreach (var item in lista)
                {
                    List<string> row = new List<string>() {
                        item.nroOrden.ToString(),
                        item.tipoEvento,
                        item.fechaHora,
                        item.duracion.ToString(),
                        item.descripcion,
                        item.caravanas
                    };
                    data.DataRows.Add(row);
                }
                var archivo = StaticFunctions.GenerateExcel(data, "ReportesEventos", filter.campo, filter.usuario, filter.periodo);
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

        public Documento EventosExportarPDF(EventoFilter filter)
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

                var fecha = DateTime.Now.ToString("dd-MM-yyyyHHmm");
                // Nombre del archivo
                string fileName = string.Format("{0}-{1}-{2}.pdf", "Eventos", filter.campo, fecha);
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
                fecha = DateTime.Now.ToString("dd-MM-yyyy HH:mm");
                html = @"
                            <html><head></head><body>
                            <table>
                            <tr><td><b>Eventos</b></td></tr>
                            <tr><td>Campo: <b>" + filter.campo + @"</b></td></tr>
                            <tr><td>Generado por: <b>" + filter.usuario + @"</b></td></tr>
                            <tr><td>Fecha: <b>" + fecha + @"</b></td></tr>   
                            <tr><td>Período: <b>" + filter.periodo + @"</b></td></tr>                
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
                    string caravana, tipoEvento = "Sin datos";
                    if (filter.numCaravana == 0) caravana = "Sin datos";
                    else
                        caravana = filter.numCaravana.ToString();
                    if (filter.idTipoEvento != 0)
                    {
                        switch (filter.idTipoEvento)
                        {
                            case 1:
                                tipoEvento = "Vacunación";
                                break;
                            case 2:
                                tipoEvento = "Antibiótico";
                                break;
                            case 3:
                                tipoEvento = "Manejo";
                                break;
                            case 4:
                                tipoEvento = "Alimenticio";
                                break;
                        }
                    }

                    html = @"
                            <html><head></head><body>
                            <table>
                            <tr><td><b>Filtro Aplicado</b></td><td></td><td></td><td></td></tr>                
                            </table>
                            <table border='1'>
                            <thead>
                            <tr>
                            <th>Caravana</th>
                            <th>Tipo Evento</th>       
                            <th>Fecha Desde</th>    
                            <th>Fecha Hasta</th>";
                    html += @"</tr>               
                            </thead>
                            <tbody>
                            <tr><td>" + caravana + @"</td><td>" + tipoEvento + @"</td><td>" + (filter.fechaDesde == null ? "Sin datos" : filter.fechaDesde) + @"</td><td>" + (filter.fechaHasta == null ? "Sin datos" : filter.fechaHasta) + @"</td></tr>
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
                            <th>Tipo Evento</th>
                            <th>Fecha Evento</th>       
                            <th>Bovinos que participaron</th> 
                            </tr>               
                            </thead>
                            <tbody>";
                    foreach (var item in lista)
                    {
                        html += @"<tr><td>" + item.tipoEvento + @"</td><td>" + item.fechaHora + @"</td><td>" + item.cantidadBovinos + @"</td></tr>";
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

        public Documento EventosExportarExcel(EventoFilter filter)
        {
            SLExcelData data = new SLExcelData();
            try
            {
                data.HeadersFiltro = new List<string>();
                data.HeadersFiltro.Add("Caravana");
                data.HeadersFiltro.Add("Tipo Evento");
                data.HeadersFiltro.Add("Fecha Desde");
                data.HeadersFiltro.Add("Fecha hasta");

                List<string> rowFiltro = new List<string>();
                if (filter.numCaravana != 0)
                    rowFiltro.Add(filter.numCaravana.ToString());
                else
                    rowFiltro.Add("Sin datos");
                switch (filter.idTipoEvento)
                {
                    case 1:
                        rowFiltro.Add("Vacunación");
                        break;
                    case 2:
                        rowFiltro.Add("Antibiótico");
                        break;
                    case 3:
                        rowFiltro.Add("Manejo");
                        break;
                    case 4:
                        rowFiltro.Add("Alimenticio");
                        break;
                    default:
                        rowFiltro.Add("Sin datos");
                        break;
                }
                if(filter.fechaDesde != null) rowFiltro.Add(filter.fechaDesde);
                else rowFiltro.Add("Sin datos");
                if (filter.fechaHasta != null) rowFiltro.Add(filter.fechaHasta);
                else rowFiltro.Add("Sin datos");
                data.DataRowsFiltro = new List<List<string>>();
                data.DataRowsFiltro.Add(rowFiltro);

                var lista = GetList(filter);
                data.Headers.Add("Tipo Evento");
                data.Headers.Add("Fecha Evento");
                data.Headers.Add("Bovinos que participaron");

                foreach (var item in lista)
                {
                    List<string> row = new List<string>() {
                        item.tipoEvento.ToString(),
                        item.fechaHora,
                        item.cantidadBovinos.ToString()
                    };
                    data.DataRows.Add(row);
                }
                var archivo = StaticFunctions.GenerateExcel(data, "Eventos", filter.campo, filter.usuario, filter.periodo);
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
