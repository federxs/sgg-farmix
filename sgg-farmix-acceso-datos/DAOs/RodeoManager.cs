using sgg_farmix_acceso_datos.Helper;
using sgg_farmix_acceso_datos.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace sgg_farmix_acceso_datos.DAOs
{
    public class RodeoManager : IManager<Rodeo>
    {
        private SqlServerConnection connection;
        public Rodeo Create(Rodeo entity)
        {
            connection = new SqlServerConnection();
            try
            {
                var parametros = new Dictionary<string, object>
                {
                    {"@confinado", entity.confinado },
                    {"@nombre", entity.nombre },                    
                    {"@codigoCampo", entity.idCampo }
                };

                entity.idRodeo = connection.Execute("spRegistrarRodeo", parametros, System.Data.CommandType.StoredProcedure);
                if (entity.idRodeo == 0)
                    throw new ArgumentException("Create Rodeo Error");
                else if (entity.idRodeo == -1)
                    throw new ArgumentException("Rodeo ya existe");
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

        public IEnumerable<Rodeo> GetList(long idCampo)
        {
            try
            {
                connection = new SqlServerConnection();
                Dictionary<string, object> parametros = null;
                if (idCampo != 0)
                {
                    parametros = new Dictionary<string, object>();
                    parametros.Add("@idCampo", idCampo);
                }
                var lista = connection.GetArray<Rodeo>("spGetRodeos", parametros, System.Data.CommandType.StoredProcedure);
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

        public void Delete(long id)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<Rodeo> Get(Rodeo entity)
        {
            throw new NotImplementedException();
        }

        public Rodeo Get(long id)
        {
            throw new NotImplementedException();
        }

        public Rodeo GetFilter()
        {
            throw new NotImplementedException();
        }

        public Rodeo Update(long id, Rodeo entity)
        {
            throw new NotImplementedException();
        }
    }
}
