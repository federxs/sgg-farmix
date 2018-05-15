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
    public class VacunaManager : IManager<Vacuna>
    {
        private SqlServerConnection connection;
        public Vacuna Create(Vacuna entity)
        {
            connection = new SqlServerConnection();
            try
            {
                var parametros = new Dictionary<string, object>
                {
                    {"@nombre", entity.nombre },
                    {"@codigoCampo", entity.codigoCampo }
                };

                entity.idVacuna = connection.Execute("spRegistrarVacuna", parametros, System.Data.CommandType.StoredProcedure);
                if (entity.idVacuna == 0)
                    throw new ArgumentException("Create Vacuna Error");
                else if (entity.idVacuna == -1)
                    throw new ArgumentException("Vacuna ya existe");
                return entity;
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

        public void Delete(long id)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<Vacuna> Get(Vacuna entity)
        {
            throw new NotImplementedException();
        }

        public Vacuna Get(long id)
        {
            throw new NotImplementedException();
        }

        public Vacuna GetFilter()
        {
            throw new NotImplementedException();
        }

        public Vacuna Update(long id, Vacuna entity)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<Vacuna> GetList(long codigoCampo)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>{
                    { "@codigoCampo", codigoCampo}
                };
                var lista = connection.GetArray<Vacuna>("spGetVacunas", parametros, System.Data.CommandType.StoredProcedure);
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
