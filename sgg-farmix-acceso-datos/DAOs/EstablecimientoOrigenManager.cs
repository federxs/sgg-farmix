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
    public class EstablecimientoOrigenManager : IManager<EstablecimientoOrigen>
    {
        private SqlServerConnection connection;
        public EstablecimientoOrigen Create(EstablecimientoOrigen entity)
        {
            connection = new SqlServerConnection();
            try
            {
                var parametros = new Dictionary<string, object>
                {
                    {"@nombre", entity.nombre },
                    {"@idLocalidad", entity.idLocalidad },
                    {"@codigoCampo", entity.codigoCampo }
                };              

                entity.idEstablecimiento = connection.Execute("spRegistrarEstablecimientoOrigen", parametros, System.Data.CommandType.StoredProcedure);
                if (entity.idEstablecimiento == 0)
                    throw new ArgumentException("Create Establecimiento Origen Error");
                else if (entity.idEstablecimiento == -1)
                    throw new ArgumentException("Establecimiento Origen ya existe");                
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

        public IEnumerable<EstablecimientoOrigen> Get(EstablecimientoOrigen entity)
        {
            throw new NotImplementedException();
        }

        public EstablecimientoOrigen Get(long id)
        {
            throw new NotImplementedException();
        }

        public EstablecimientoOrigen GetFilter()
        {
            throw new NotImplementedException();
        }

        public EstablecimientoOrigen Update(long id, EstablecimientoOrigen entity)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<EstablecimientoOrigen> GetList(long codigoCampo)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>{
                    { "@codigoCampo", codigoCampo}
                };
                var lista = connection.GetArray<EstablecimientoOrigen>("spGetEstabOrigen", parametros, System.Data.CommandType.StoredProcedure);
                return lista.ToList();
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
