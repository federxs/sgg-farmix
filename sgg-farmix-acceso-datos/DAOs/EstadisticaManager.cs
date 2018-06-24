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
    public class EstadisticaManager : IManager<Estadisticas>
    {
        private SqlServerConnection connection;
        public Estadisticas Create(Estadisticas entity)
        {
            throw new NotImplementedException();
        }

        public void Delete(long id)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<Estadisticas> Get(Estadisticas entity)
        {
            throw new NotImplementedException();
        }

        public Estadisticas Get(long id)
        {
            throw new NotImplementedException();
        }

        public Estadisticas GetFilter()
        {
            throw new NotImplementedException();
        }

        public Estadisticas Update(long id, Estadisticas entity)
        {
            throw new NotImplementedException();
        }

        public EstadisticasBovino GetEstadisticaBovino(long codigoCampo, string periodo)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>{
                    { "@codigoCampo", codigoCampo },
                    { "@periodo", periodo },
                    { "@mes", 0 }
                };
                var obj = new EstadisticasBovino();
                obj.bajasXMes = new List<EstadisticaBajaPorMes>();
                obj.nacimientos = new List<EstadisticaNacimientosXMes>();
                for (int i = 1; i < 13; i++)
                {
                    parametros["@mes"] = i;
                    var registro1 = connection.GetArray<EstadisticaBajaPorMes>("spReporteBovinoBajasPorMes", parametros, System.Data.CommandType.StoredProcedure).FirstOrDefault();                    
                    obj.bajasXMes.Add(registro1);
                    var registro2 = connection.GetArray<EstadisticaNacimientosXMes>("spReporteBovinoNacimientosPorMes", parametros, System.Data.CommandType.StoredProcedure).FirstOrDefault();
                    obj.nacimientos.Add(registro2);
                }
                parametros = new Dictionary<string, object>{
                    { "@codigoCampo", codigoCampo },
                    { "@periodo", periodo }
                };
                obj.top10Alimentos = connection.GetArray<EstadisticaTop10Alimentos>("spReporteBovinoTop10Alimentos", parametros, System.Data.CommandType.StoredProcedure).ToList();
                parametros = new Dictionary<string, object>{
                    { "@codigoCampo", codigoCampo }
                };
                obj.bovinosXRodeo = connection.GetArray<EstadisticaBovinosXRodeo>("spReporteBovinoCantidadPorRodeo", parametros, System.Data.CommandType.StoredProcedure).ToList();
                obj.pesosPromXRaza = connection.GetArray<EstadisticaPesoPromXRaza>("spReporteBovinoPesoPromedioPorRaza", parametros, System.Data.CommandType.StoredProcedure).ToList();                
                return obj;
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
