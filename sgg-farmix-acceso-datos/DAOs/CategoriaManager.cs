using sgg_farmix_acceso_datos.Helper;
using sgg_farmix_acceso_datos.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace sgg_farmix_acceso_datos.DAOs
{
    public class CategoriaManager : IManager<Categoria>
    {
        private SqlServerConnection connection;
        public Categoria Create(Categoria entity)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<Categoria> GetList()
        {
            try
            {
                connection = new SqlServerConnection();
                var lista = connection.GetArray<Categoria>("spGetCategorias", null, System.Data.CommandType.StoredProcedure);
                return lista;
            }
            catch (Exception)
            {
                return null;
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

        public IEnumerable<Categoria> Get(Categoria entity)
        {
            throw new NotImplementedException();
        }

        public Categoria Get(long id)
        {
            throw new NotImplementedException();
        }

        public Categoria GetFilter()
        {
            throw new NotImplementedException();
        }

        public Categoria Update(long id, Categoria entity)
        {
            throw new NotImplementedException();
        }
    }
}
