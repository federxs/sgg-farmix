using sgg_farmix_acceso_datos.Helper;
using sgg_farmix_acceso_datos.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace sgg_farmix_acceso_datos.DAOs
{
    public class TipoEventoManager : IManager<TipoEvento>
    {
        private SqlServerConnection connection;
        public TipoEvento Create(TipoEvento entity)
        {
            throw new NotImplementedException();
        }

        public void Delete(long id)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<TipoEvento> Get(TipoEvento entity)
        {
            throw new NotImplementedException();
        }

        public TipoEvento Get(long id)
        {
            throw new NotImplementedException();
        }

        public TipoEvento GetFilter()
        {
            throw new NotImplementedException();
        }

        public TipoEvento Update(long id, TipoEvento entity)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<TipoEvento> GetList()
        {
            try
            {
                connection = new SqlServerConnection();
                var lista = connection.GetArray<TipoEvento>("spGetTiposEvento", null, System.Data.CommandType.StoredProcedure);
                return lista;
            }
            catch (Exception ex)
            {
                return null;
            }
            finally
            {
                connection.Close();
            }
        }
    }
}
