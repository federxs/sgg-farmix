using sgg_farmix_acceso_datos.Helper;
using sgg_farmix_acceso_datos.Model;
using sgg_farmix_helper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace sgg_farmix_acceso_datos.DAOs
{
    public class CampoManager : IManager<Campo>
    {
        private SqlServerConnection connection;
        public Campo Create(Campo entity)
        {
            throw new NotImplementedException();
        }

        public void Delete(long id)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<Campo> Get(Campo entity)
        {
            throw new NotImplementedException();
        }

        public Campo Get(long id)
        {
            throw new NotImplementedException();
        }

        public Campo GetFilter()
        {
            throw new NotImplementedException();
        }

        public Campo Update(long id, Campo entity)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<Campo> GetList(string usuario)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@usuario", usuario }
                };
                var campos = connection.GetArray<Campo>("spGetCampos", parametros, System.Data.CommandType.StoredProcedure);
                return campos;
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
