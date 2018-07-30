using iTextSharp.text;
using iTextSharp.text.html.simpleparser;
using iTextSharp.text.pdf;
using sgg_farmix_acceso_datos.Helper;
using sgg_farmix_acceso_datos.Model;
using sgg_farmix_helper;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using static iTextSharp.text.Font;

namespace sgg_farmix_acceso_datos.DAOs
{
    public class UsuarioManager : IManager<Usuario>
    {
        private SqlServerConnection connection;
        public Usuario Create(Usuario entity)
        {
            throw new NotImplementedException();
        }

        public void Delete(long id, long codigoCampo)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@idUsuario", id },
                    {"@codigoCampo", codigoCampo }
                };
                var delete = connection.Execute("spBajaUsuario", parametros, System.Data.CommandType.StoredProcedure);
                if (delete == 0)
                    throw new ArgumentException("Baja Usuario Error");
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

        public IEnumerable<Usuario> Get(Usuario entity)
        {
            throw new NotImplementedException();
        }

        public Usuario Get(long id)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@idUsuario", id }
                };
                var usuario = connection.GetArray<Usuario>("spObtenerDatosUsuario", parametros, System.Data.CommandType.StoredProcedure).FirstOrDefault();
                return usuario;
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

        public Usuario GetFilter()
        {
            throw new NotImplementedException();
        }

        public Usuario Update(long id, Usuario entity)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@idUsuario", id },
                    {"@nombre", entity.nombre },
                    {"@apellido", entity.apellido },
                    {"@usuario", entity.usuario },
                    {"@idRol", entity.idRol }
                };
                if (entity.contrasenia != null)
                {
                    var clave = Encrypt.GetMD5(entity.contrasenia);
                    parametros.Add("@contrasenia", clave);
                }
                var update = connection.Execute("spModificarUsuario", parametros, System.Data.CommandType.StoredProcedure);
                if (update == 0)
                    throw new ArgumentException("Update Usuario Error");
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

        public ResultadoValidacion ValidarUsuario(Usuario entity)
        {
            Random randomToken;
            try
            {
                connection = new SqlServerConnection();
                string claveEncriptada = Encrypt.GetMD5(entity.pass);
                randomToken = new Random();
                string token = StaticFunctions.GetRandomPassword(randomToken, 8);
                var parametros = new Dictionary<string, object>
                {
                    {"@usuario", entity.usuario },
                    {"@pass", claveEncriptada },
                    {"@rol", entity.idRol },
                    {"@token", token }
                };
                var result = connection.GetArray<ResultadoValidacion>("spValidarUsuario", parametros, System.Data.CommandType.StoredProcedure).FirstOrDefault();
                if (result.resultado == 0)
                {
                    parametros["@rol"] = 2;
                    result = connection.GetArray<ResultadoValidacion>("spValidarUsuario", parametros, System.Data.CommandType.StoredProcedure).FirstOrDefault();
                }
                if (result.resultado == 0)
                {
                    parametros["@rol"] = 4; //este rol es el de administracion, es solo para nosotros
                    result = connection.GetArray<ResultadoValidacion>("spValidarUsuario", parametros, System.Data.CommandType.StoredProcedure).FirstOrDefault();
                }
                return result;
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

        public IEnumerable<Usuario> GetList(UsuarioFilter filtro)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@codigoCampo", filtro.codigoCampo },
                    {"@nombre", filtro.nombre },
                    {"@apellido", filtro.apellido },
                    {"@idRol", filtro.idRol },
                    {"@rolLogueado", filtro.rolLogueado }
                };
                var lista = connection.GetArray<Usuario>("spObtenerListaUsuarios", parametros, System.Data.CommandType.StoredProcedure);
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

        public Usuario Create(Usuario entity, long codigoCampo)
        {
            connection = new SqlServerConnection();
            DbTransaction transaction = connection.BeginTransaction();
            try
            {
                var clave = Encrypt.GetMD5(entity.pass);
                var parametros = new Dictionary<string, object>
                {
                    {"@usuario", entity.usuario },
                    {"@nombre", entity.nombre },
                    {"@apellido", entity.apellido },
                    {"@pass", clave },
                    {"@idRol", entity.idRol },
                    {"@codigoCampo", codigoCampo }
                };
                entity.idUsuario = connection.Execute("spRegistrarUsuario", parametros, System.Data.CommandType.StoredProcedure, transaction);
                if (entity.idUsuario == 0)
                    throw new ArgumentException("Create Usuario Error");
                else if (entity.idUsuario == -1)
                    throw new ArgumentException("El usuario ya existe para este campo");
                var param = new Dictionary<string, object>
                {
                    {"@idUsuario", entity.idUsuario },
                    {"@codigoCampo", codigoCampo }
                };
                var insert = connection.Execute("spRegistrarUsuarioEnCampo", param, System.Data.CommandType.StoredProcedure, transaction);
                if (insert == 0)
                    throw new ArgumentException("Create Usuario por Campo Error");
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

        public UsuarioDetalle GetDetalle(long id)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@idUsuario", id }
                };
                var usuario = connection.GetArray<UsuarioDetalle>("spObtenerDetalleUsuario", parametros, System.Data.CommandType.StoredProcedure).FirstOrDefault();
                return usuario;
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

        public void Activar(long id, long codigoCampo)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@idUsuario", id },
                    {"@codigoCampo", codigoCampo }
                };
                var activar = connection.Execute("spActivarUsuario", parametros, System.Data.CommandType.StoredProcedure);
                if (activar == 0)
                    throw new ArgumentException("Activar Usuario Error");
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

        public UsuarioLogueado GetDatosUserLogueado(string user, long campo, long idRol, string periodo)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@usuario", user },
                    {"@codigoCampo", campo },
                    {"@idRol", idRol },
                    {"@periodo", periodo }
                };
                var usuario = connection.GetArray<UsuarioLogueado>("spObtenerDatosUsuarioLogueado", parametros, System.Data.CommandType.StoredProcedure).FirstOrDefault();
                return usuario;
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

        public Usuario GetPerfil(string usuario)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@usuario", usuario }
                };
                var perfil = connection.GetArray<Usuario>("spObtenerPerfilUsuario", parametros, System.Data.CommandType.StoredProcedure).FirstOrDefault();
                return perfil;
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

        public ResultadoValidacionCampo ValidarCantidadUsuarios(long campo)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@codigoCampo", campo }
                };
                var resultado = connection.GetArray<ResultadoValidacionCampo>("spValidarCantidadUsuarios", parametros, System.Data.CommandType.StoredProcedure);
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

        public UsuarioLogueado UpdatePerfil(UsuarioLogueado entity)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>()
                {
                    {"@nombre", entity.nombre },
                    {"@apellido", entity.apellido },
                    {"@usuario", entity.usuario }
                };
                entity.idUsuario = connection.Execute("spActualizarDatosPerfil", parametros, System.Data.CommandType.StoredProcedure);
                if (entity.idUsuario == 0)
                    throw new ArgumentException("Update Perfil Error");
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

        public long CambiarPass(string passVieja, string passNueva, string usuario, long rol)
        {
            try
            {
                connection = new SqlServerConnection();
                var claveVieja = Encrypt.GetMD5(passVieja);
                var claveNueva = Encrypt.GetMD5(passNueva);
                var parametros = new Dictionary<string, object>
                {
                    {"@passVieja", claveVieja },
                    {"@passNueva", claveNueva },
                    {"@usuario", usuario },
                    {"@rol", rol }
                };
                var user = connection.GetArray<Usuario>("spModificarPass", parametros, System.Data.CommandType.StoredProcedure).FirstOrDefault();
                if (user.idUsuario == 0)
                    throw new ArgumentException("Update Contraseña Error");
                return user.idUsuario;
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

        public Documento UsuariosExportarPDF(UsuarioFilter filter)
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
                string fileName = string.Format("{0}-{1}-{2}.pdf", "Usuarios", filter.campo, fecha);
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
                            <tr><td><b>Usuarios</b></td></tr>
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
                    string nombre, apellido, rol = "Sin datos";
                    if (filter.nombre == null) nombre = "Sin datos";
                    else
                        nombre = filter.nombre;
                    if (filter.apellido == null) apellido = "Sin datos";
                    else
                        apellido = filter.apellido;
                    if (filter.idRol != 0)
                    {
                        switch (filter.idRol)
                        {
                            case 1:
                                rol = "Dueño";
                                break;
                            case 2:
                                rol = "Ingeniero";
                                break;
                            case 3:
                                rol = "Peón";
                                break;
                        }
                    }

                    html = @"
                            <html><head></head><body>
                            <table>
                            <tr><td><b>Filtro Aplicado</b></td><td></td><td></td></tr>                
                            </table>
                            <table border='1'>
                            <thead>
                            <tr>
                            <th>Nombre</th>
                            <th>Apellido</th>       
                            <th>Rol</th>";
                    html += @"</tr>               
                            </thead>
                            <tbody>
                            <tr><td>" + nombre + @"</td><td>" + apellido + @"</td><td>" + rol + @"</td></tr>
                            </tbody></table></body></html>";
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
                    doc.Add(new Paragraph(" "));
                    html = @"
                            <html><head></head><body>
                            <table border='1'>
                            <thead>
                            <tr>
                            <th>Usuario</th>
                            <th>Nombre</th>       
                            <th>Apellido</th>
                            <th>Rol</th>
                            <th>Estado</th>
                            <th>Fecha Alta</th>
                            <th>Fecha Baja</th> 
                            </tr>               
                            </thead>
                            <tbody>";
                    foreach (var item in lista)
                    {
                        html += @"<tr><td>" + item.usuario + @"</td><td>" + item.nombre + @"</td><td>" + item.apellido + @"</td><td>" + item.rol + @"</td><td>" + (item.fechaBaja == " " ? "Activo" : "Inactivo") + @"</td><td>" + item.fechaAlta + @"</td><td>" + (item.fechaBaja == " " ? "-" : item.fechaBaja) + @"</td></tr>";
                    }
                    html += @"</tbody></table>
                            </body></html> ";
                    ie = HTMLWorker.ParseToList(new StringReader(html), null);
                    foreach (IElement element in ie)
                    {
                        PdfPTable table = element as PdfPTable;

                        if (table != null)
                        {
                            table.SetWidthPercentage(new float[] { (float).14 * pageWidth, (float).14 * pageWidth, (float).14 * pageWidth, (float).14 * pageWidth, (float).1 * pageWidth, (float).16 * pageWidth, (float).16 * pageWidth }, rect);
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

        public Documento UsuariosExportarExcel(UsuarioFilter filter)
        {
            SLExcelData data = new SLExcelData();
            try
            {
                data.HeadersFiltro = new List<string>();
                data.HeadersFiltro.Add("Nombre");
                data.HeadersFiltro.Add("Apellido");
                data.HeadersFiltro.Add("Rol");

                List<string> rowFiltro = new List<string>();
                if (filter.nombre != null)
                    rowFiltro.Add(filter.nombre);
                else
                    rowFiltro.Add("Sin datos");
                if (filter.apellido != null) rowFiltro.Add(filter.apellido);
                else rowFiltro.Add("Sin datos");

                switch (filter.idRol)
                {
                    case 1:
                        rowFiltro.Add("Dueño");
                        break;
                    case 2:
                        rowFiltro.Add("Ingeniero");
                        break;
                    case 3:
                        rowFiltro.Add("Peón");
                        break;
                    default:
                        rowFiltro.Add("Sin datos");
                        break;
                }
                data.DataRowsFiltro = new List<List<string>>();
                data.DataRowsFiltro.Add(rowFiltro);

                var lista = GetList(filter);
                data.Headers.Add("Usuario");
                data.Headers.Add("Nombre");
                data.Headers.Add("Apellido");
                data.Headers.Add("Rol");
                data.Headers.Add("Estado");
                data.Headers.Add("Fecha Alta");
                data.Headers.Add("Fecha Baja");

                foreach (var item in lista)
                {
                    List<string> row = new List<string>();
                    row.Add(item.usuario);
                    row.Add(item.nombre);
                    row.Add(item.apellido);
                    if (item.idRol == 1) row.Add("Dueño");
                    else if (item.idRol == 2) row.Add("Ingeniero");
                    else row.Add("Peón");
                    row.Add(item.fechaBaja == " " ? "Activo" : "Inactivo");
                    row.Add(item.fechaAlta != " " ? item.fechaAlta : "-");
                    row.Add(item.fechaBaja != " " ? item.fechaBaja : "-");
                    data.DataRows.Add(row);
                }
                var archivo = StaticFunctions.GenerateExcel(data, "Usuarios", filter.campo, filter.usuario, filter.periodo);
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

        public IEnumerable<Cliente> GetClientes(ReporteFilter filtro)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@nombre", filtro.nombre },
                    {"@apellido", filtro.apellido },
                    {"@idPlan", filtro.idPlan },
                    {"@fechaDesde", filtro.fechaDesde },
                    {"@fechaHasta", filtro.fechaHasta }
                    //{"@periodo", filtro.periodo }
                };
                if (filtro.estadoCuenta != "0")
                    parametros.Add("@estadoCuenta", filtro.estadoCuenta);
                var resultado = connection.GetArray<Cliente>("spGetClientes", parametros, System.Data.CommandType.StoredProcedure);
                return resultado;
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

        public IEnumerable<Plan> GetPlanes()
        {
            try
            {
                connection = new SqlServerConnection();
                var resultado = connection.GetArray<Plan>("spGetPlanes", null, System.Data.CommandType.StoredProcedure);
                return resultado;
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

        public Documento ClientesExportarPDF(ReporteFilter filter)
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
                string fileName = string.Format("{0}-{1}.pdf", "Clientes", fecha);
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
                var lista = GetClientes(filter);
                Font fuente1 = new Font(FontFamily.TIMES_ROMAN, 12.0f, Font.BOLD, BaseColor.BLACK);
                Font fuente2 = new Font(FontFamily.TIMES_ROMAN, 14.0f, Font.BOLD, BaseColor.BLACK);
                Rectangle rect = PageSize.LETTER;
                List<IElement> ie;
                float pageWidth = rect.Width;
                string html = "";
                html = @"
                            <html><head></head><body>
                            <table>
                            <tr><td><b>Clientes</b></td></tr>
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
                    string nombre, apellido, plan;
                    if (filter.nombre == null) nombre = "Sin datos";
                    else
                        nombre = filter.nombre;
                    if (filter.apellido == null) apellido = "Sin datos";
                    else
                        apellido = filter.apellido;
                    switch (filter.idPlan)
                    {
                        case 1:
                            plan = "Plan pequeño";
                            break;
                        case 2:
                            plan = "Plan mediano";
                            break;
                        case 3:
                            plan = "Plan grande";
                            break;
                        case 4:
                            plan = "Plan super";
                            break;
                        default:
                            plan = "Sin datos";
                            break;
                    }
                    html = @"
                            <html><head></head><body>
                            <table>
                            <tr><td><b>Filtro Aplicado</b></td><td></td><td></td><td></td><td></td><td></td></tr>                
                            </table>
                            <table border='1'>
                            <thead>
                            <tr>
                            <th>Nombre</th>
                            <th>Apellido</th>       
                            <th>Estado Cuenta</th>
                            <th>Plan</th>
                            <th>Fecha Desde</th>
                            <th>Fecha Hasta</th>";
                    html += @"</tr>               
                            </thead>
                            <tbody>
                            <tr><td>" + nombre + @"</td><td>" + apellido + @"</td><td>" + (filter.estadoCuenta != "0" ? filter.estadoCuenta : "Sin datos") + @"</td><td>" + plan + @"</td><td>" + (filter.fechaDesde != null ? filter.fechaDesde : "Sin datos") + @"</td><td>" + (filter.fechaHasta != null ? filter.fechaHasta : "Sin datos") + @"</td></tr>
                            </tbody></table></body></html>";
                    ie = HTMLWorker.ParseToList(new StringReader(html), null);
                    foreach (IElement element in ie)
                    {
                        PdfPTable table = element as PdfPTable;

                        if (table != null)
                        {
                            table.SetWidthPercentage(new float[] { (float).16 * pageWidth, (float).16 * pageWidth, (float).16 * pageWidth, (float).16 * pageWidth, (float).16 * pageWidth, (float).16 * pageWidth }, rect);
                        }
                        doc.Add(element);
                    }
                    doc.Add(new Paragraph(" "));
                    html = @"
                            <html><head></head><body>
                            <table border='1'>
                            <thead>
                            <tr>
                            <th>Apellido</th>
                            <th>Nombre</th>                           
                            <th>Fecha Alta</th>
                            <th>Plan Contratado</th>
                            <th>Administradores</th>
                            <th>Usuarios</th>
                            <th>Campos</th>
                            <th>Bovinos</th>
                            <th>Estado cuenta</th>
                            </tr>               
                            </thead>
                            <tbody>";
                    foreach (var item in lista)
                    {
                        html += @"<tr><td>" + item.apellido + @"</td><td>" + item.nombre + @"</td><td>" + item.fechaAlta + @"</td><td>" + item.nombrePlan + @"</td><td>" + item.cantidadAdministradores + @"</td><td>" + item.cantidadUsuarios + @"</td><td>" + item.cantidadCampos + @"</td><td>" + item.cantidadBovinos + @"</td><td>" + item.estadoCuenta + @"</td></tr>";
                    }
                    html += @"</tbody></table>
                            </body></html> ";
                    ie = HTMLWorker.ParseToList(new StringReader(html), null);
                    foreach (IElement element in ie)
                    {
                        PdfPTable table = element as PdfPTable;

                        if (table != null)
                        {
                            table.SetWidthPercentage(new float[] { (float).1 * pageWidth, (float).1 * pageWidth, (float).1 * pageWidth, (float).1 * pageWidth, (float).1 * pageWidth, (float).1 * pageWidth, (float).1 * pageWidth, (float).1 * pageWidth, (float).1 * pageWidth }, rect);
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

        public Documento ClientesExportarExcel(ReporteFilter filter)
        {
            SLExcelData data = new SLExcelData();
            try
            {
                data.HeadersFiltro = new List<string>();
                data.HeadersFiltro.Add("Apellido");
                data.HeadersFiltro.Add("Nombre");                
                data.HeadersFiltro.Add("Estado Cuenta");
                data.HeadersFiltro.Add("Plan");
                data.HeadersFiltro.Add("Fecha Desde");
                data.HeadersFiltro.Add("Fecha Hasta");

                List<string> rowFiltro = new List<string>();
                if (filter.apellido != null) rowFiltro.Add(filter.apellido);
                else rowFiltro.Add("Sin datos");
                if (filter.nombre != null)
                    rowFiltro.Add(filter.nombre);
                else
                    rowFiltro.Add("Sin datos");
                if (filter.estadoCuenta != "0") rowFiltro.Add(filter.estadoCuenta);
                else rowFiltro.Add("Sin datos");
                switch (filter.idPlan)
                {
                    case 1:
                        rowFiltro.Add("Plan pequeño");
                        break;
                    case 2:
                        rowFiltro.Add("Plan mediano");
                        break;
                    case 3:
                        rowFiltro.Add("Plan grande");
                        break;
                    case 4:
                        rowFiltro.Add("Plan super");
                        break;
                    default:
                        rowFiltro.Add("Sin datos");
                        break;
                }
                if (filter.fechaDesde != null) rowFiltro.Add(filter.fechaDesde);
                else rowFiltro.Add("Sin datos");
                if (filter.fechaHasta != null) rowFiltro.Add(filter.fechaHasta);
                else rowFiltro.Add("Sin datos");
                data.DataRowsFiltro = new List<List<string>>();
                data.DataRowsFiltro.Add(rowFiltro);

                var lista = GetClientes(filter);
                data.Headers.Add("Apellido");
                data.Headers.Add("Nombre");
                data.Headers.Add("Fecha Alta");
                data.Headers.Add("Plan Contratado");
                data.Headers.Add("Administradores");
                data.Headers.Add("Usuarios");
                data.Headers.Add("Campos");
                data.Headers.Add("Bovinos");
                data.Headers.Add("Estado Cuenta");

                foreach (var item in lista)
                {
                    List<string> row = new List<string>();
                    row.Add(item.apellido);
                    row.Add(item.nombre);
                    row.Add(item.fechaAlta);
                    if (item.idPlan == 1) row.Add("Plan Pequeño");
                    else if (item.idPlan == 2) row.Add("Plan Mediano");
                    else if (item.idPlan == 3) row.Add("Plan Grande");
                    else row.Add("Plan Super");
                    row.Add(item.cantidadAdministradores.ToString());
                    row.Add(item.cantidadUsuarios.ToString());
                    row.Add(item.cantidadCampos.ToString());
                    row.Add(item.cantidadBovinos.ToString());
                    row.Add(item.estadoCuenta);
                    data.DataRows.Add(row);
                }
                var archivo = StaticFunctions.GenerateExcel(data, "Clientes", filter.campo, filter.usuario, filter.periodo);
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
