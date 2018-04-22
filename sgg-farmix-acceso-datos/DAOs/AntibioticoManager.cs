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
    public class AntibioticoManager : IManager<Antibiotico>
    {
        private SqlServerConnection connection;
        public Antibiotico Create(Antibiotico entity)
        {
            throw new NotImplementedException();
        }

        public void Delete(long id)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<Antibiotico> Get(Antibiotico entity)
        {
            throw new NotImplementedException();
        }

        public Antibiotico Get(long id)
        {
            throw new NotImplementedException();
        }

        public Antibiotico GetFilter()
        {
            throw new NotImplementedException();
        }

        public Antibiotico Update(long id, Antibiotico entity)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<Antibiotico> GetList(long codigoCampo)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>{
                    { "@codigoCampo", codigoCampo}
                };
                var lista = connection.GetArray<Antibiotico>("spGetAntibioticos", parametros, System.Data.CommandType.StoredProcedure);
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
    }
}
