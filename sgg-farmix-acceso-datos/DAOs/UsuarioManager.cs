using sgg_farmix_acceso_datos.Helper;
using sgg_farmix_acceso_datos.Model;
using System;
using System.Collections.Generic;
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
            throw new NotImplementedException();
        }

        public IEnumerable<Usuario> Get(Usuario entity)
        {
            throw new NotImplementedException();
        }

        public Usuario Get(long id)
        {
            throw new NotImplementedException();
        }

        public Usuario GetFilter()
        {
            throw new NotImplementedException();
        }

        public Usuario Update(long id, Usuario entity)
        {
            throw new NotImplementedException();
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
    }
}
