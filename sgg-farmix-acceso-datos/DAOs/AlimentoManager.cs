using sgg_farmix_acceso_datos.Helper;
using sgg_farmix_acceso_datos.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace sgg_farmix_acceso_datos.DAOs
{
    public class AlimentoManager : IManager<Alimento>
    {
        private SqlServerConnection connection;
        public Alimento Create(Alimento entity)
        {
            throw new NotImplementedException();
        }

        public void Delete(long id)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<Alimento> Get(Alimento entity)
        {
            throw new NotImplementedException();
        }

        public Alimento Get(long id)
        {
            throw new NotImplementedException();
        }

        public Alimento GetFilter()
        {
            throw new NotImplementedException();
        }

        public Alimento Update(long id, Alimento entity)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<Alimento> GetList()
        {
            try
            {
                connection = new SqlServerConnection();
                var lista = connection.GetArray<Alimento>("spGetAlimentos", null, System.Data.CommandType.StoredProcedure);
                return lista;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
    }
}
