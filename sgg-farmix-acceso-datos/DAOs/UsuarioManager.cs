using sgg_farmix_acceso_datos.Helper;
using sgg_farmix_acceso_datos.Model;
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
            }
        }

        public ResultadoValidacion ValidarUsuario(Usuario entity)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@usuario", entity.usuario },
                    {"@pass", entity.pass },
                    {"@rol", entity.idRol }
                };
                var result = connection.GetArray<ResultadoValidacion>("spValidarUsuario", parametros, System.Data.CommandType.StoredProcedure).FirstOrDefault();
                return result;
            }
            catch (Exception ex)
            {
                throw;
            }
            finally
            {
                connection.Close();
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
            }
        }

        public Usuario Create(Usuario entity, long codigoCampo)
        {
            connection = new SqlServerConnection();
            DbTransaction transaction = connection.BeginTransaction();
            try
            {
                //var clave = Encrypt.GetMD5(entity.pass);
                var parametros = new Dictionary<string, object>
                {
                    {"@usuario", entity.usuario },
                    {"@nombre", entity.nombre },
                    {"@apellido", entity.apellido },
                    {"@pass", entity.pass },
                    {"@idRol", entity.idRol },
                    {"@idPlan", entity.idPlan },
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
        }
    }
}
