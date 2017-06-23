using sgg_farmix_acceso_datos.Helper;
using sgg_farmix_acceso_datos.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace sgg_farmix_acceso_datos.DAOs
{
    public class BovinoManager : IManager<Bovino>
    {
        private SqlServerConnection connection;
        public Bovino Create(Bovino entity)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@numCarava", entity.numCaravana },
                    {"@apodo", entity.apodo },
                    {"@descripcion", entity.descripcion },
                    {"@fechaNacimiento", entity.fechaNacimiento },
                    {"@genero", entity.genero },
                    {"@peso", entity.peso },
                    {"@pesoAlNacer", entity.pesoAlNacer },
                    {"@idBovinoMadre", entity.idBovinoMadre },
                    {"@idBovinoPadre", entity.idBovinoPadre },
                    {"@idCategoria", entity.idCategoria },
                    {"@idRaza", entity.idRaza },
                    {"@idRodeo", entity.idRodeo },
                    {"@idEstabOrigen", entity.idEstablecimientoOrigen },
                    {"@idEstado", entity.idEstado },
                    {"@borrado", 0 }
                };
                entity.idBovino = connection.Execute("", parametros, System.Data.CommandType.StoredProcedure);
                return entity;
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

        public IEnumerable<Bovino> Get(Bovino entity)
        {
            throw new NotImplementedException();
        }

        public Bovino Get(long id)
        {            
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@idBovino", id }
                };
                var bovino = connection.GetObject<Bovino>("", parametros, System.Data.CommandType.StoredProcedure);
                return bovino;
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

        public Bovino GetFilter()
        {
            throw new NotImplementedException();
        }

        public Bovino Update(long id, Bovino entity)
        {
            throw new NotImplementedException();
        }
    }
}
