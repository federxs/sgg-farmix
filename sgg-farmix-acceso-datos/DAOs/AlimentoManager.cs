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
            connection = new SqlServerConnection();
            try
            {
                var parametros = new Dictionary<string, object>
                {
                    {"@nombre", entity.nombre },
                    {"@codigoCampo", entity.codigoCampo }
                };

                entity.idAlimento = connection.Execute("spRegistrarAlimento", parametros, System.Data.CommandType.StoredProcedure);
                if (entity.idAlimento == 0)
                    throw new ArgumentException("Create Alimento Error");
                else if (entity.idAlimento == -1)
                    throw new ArgumentException("Alimento ya existe");
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

        public IEnumerable<Alimento> GetList(long codigoCampo)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>{
                    { "@codigoCampo", codigoCampo}
                };
                var lista = connection.GetArray<Alimento>("spGetAlimentos", parametros, System.Data.CommandType.StoredProcedure);
                return lista;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
    }
}
