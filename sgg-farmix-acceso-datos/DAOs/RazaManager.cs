using sgg_farmix_acceso_datos.Helper;
using sgg_farmix_acceso_datos.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace sgg_farmix_acceso_datos.DAOs
{
    public class RazaManager : IManager<Raza>
    {
        private SqlServerConnection connection;
        public Raza Create(Raza entity)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<Raza> GetList()
        {
            try
            {
                connection = new SqlServerConnection();
                var lista = connection.GetArray<Raza>("spGetRazas", null, System.Data.CommandType.StoredProcedure);
                return lista;
            }
            catch (Exception)
            {
                throw;
            }
            finally
            {
                connection.Close();
            }
        }

        public void Delete(long id)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<Raza> Get(Raza entity)
        {
            throw new NotImplementedException();
        }

        public Raza Get(long id)
        {
            throw new NotImplementedException();
        }

        public Raza GetFilter()
        {
            throw new NotImplementedException();
        }

        public Raza Update(long id, Raza entity)
        {
            throw new NotImplementedException();
        }
    }
}
