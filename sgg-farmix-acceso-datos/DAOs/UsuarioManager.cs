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
                if(delete == 0)
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
                if(entity.contrasenia != null)
                {
                    var clave = Encrypt.GetMD5(entity.contrasenia);
                    parametros.Add("@contrasenia", clave);
                }
                var update = connection.Execute("spModificarUsuario", parametros, System.Data.CommandType.StoredProcedure);
                if(update == 0)
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
                if(result.resultado == 0)
                {
                    parametros["@rol"] = 2;
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
                else if(entity.idUsuario == -1)
                    throw new ArgumentException("El usuario ya existe para este campo");
                var param = new Dictionary<string, object>
                {
                    {"@idUsuario", entity.idUsuario },
                    {"@codigoCampo", codigoCampo }
                };
                var insert = connection.Execute("spRegistrarUsuarioEnCampo", param, System.Data.CommandType.StoredProcedure, transaction);
                if(insert == 0)
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
                if(activar == 0)
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
    }
}
