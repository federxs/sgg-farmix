using sgg_farmix_acceso_datos.Helper;
using sgg_farmix_acceso_datos.Model;
using sgg_farmix_helper;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace sgg_farmix_acceso_datos.DAOs
{
    public class UsuarioManager : IManager<Usuario>
    {
        private SqlServerConnection connection;
        public Usuario Create(Usuario entity)
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
                    {"@idUsuario", id }
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
                    {"@idRol", filtro.idRol }
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

        public void Activar(long id)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@idUsuario", id }
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

        public UsuarioLogueado GetDatosUserLogueado(string user, long campo, long idRol)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@usuario", user },
                    {"@codigoCampo", campo },
                    {"@idRol", idRol }
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
    }
}
