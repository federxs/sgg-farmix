using sgg_farmix_acceso_datos.Helper;
using sgg_farmix_acceso_datos.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace sgg_farmix_acceso_datos.DAOs
{
    public class RolManager : IManager<Rol>
    {
        private SqlServerConnection connection;
        public Rol Create(Rol entity)
        {
            throw new NotImplementedException();
        }

        public void Delete(long id)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<Rol> Get(Rol entity)
        {
            throw new NotImplementedException();
        }

        public Rol Get(long id)
        {
            throw new NotImplementedException();
        }

        public Rol GetFilter()
        {
            throw new NotImplementedException();
        }

        public Rol Update(long id, Rol entity)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<Rol> GetRoles()
        {
            try
            {
                connection = new SqlServerConnection();
                var lista = connection.GetArray<Rol>("spGetRoles", null, System.Data.CommandType.StoredProcedure);
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
    }
}
