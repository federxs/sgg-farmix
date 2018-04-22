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
    public class EstadoManager : IManager<Estado>
    {
        private SqlServerConnection connection;

        public Estado Create(Estado entity)
        {
            connection = new SqlServerConnection();
            try
            {
                var parametros = new Dictionary<string, object>
                {                    
                    {"@nombre", entity.nombre },
                    {"@descripcion", entity.descripcion }
                };

                entity.idEstado = connection.Execute("spRegistrarEstado", parametros, System.Data.CommandType.StoredProcedure);
                if (entity.idEstado == 0)
                    throw new ArgumentException("Create Estado Error");
                else if (entity.idEstado == -1)
                    throw new ArgumentException("Estado ya existe");
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

        public IEnumerable<Estado> Get(Estado entity)
        {
            throw new NotImplementedException();
        }

        public Estado Get(long id)
        {
            throw new NotImplementedException();
        }

        public Estado GetFilter()
        {
            throw new NotImplementedException();
        }

        public IEnumerable<Estado> GetList(long idAmbito)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@idAmbitoEstado", idAmbito }
                };
                var lista = connection.GetArray<Estado>("spGetEstados", parametros, System.Data.CommandType.StoredProcedure);
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

        public Estado Update(long id, Estado entity)
        {
            throw new NotImplementedException();
        }
    }
}
