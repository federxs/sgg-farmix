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
                obj.ultimosBovinosBajas = connection.GetArray<EstadisticaUltimosBovinosBaja>("spBovinoReporteUltimosBovinosBaja", parametros, System.Data.CommandType.StoredProcedure).ToList();
                parametros = new Dictionary<string, object>{
                    { "@codigoCampo", codigoCampo }
                };
                obj.bovinosXRodeo = connection.GetArray<EstadisticaBovinosXRodeo>("spReporteBovinoCantidadPorRodeo", parametros, System.Data.CommandType.StoredProcedure).ToList();
                obj.pesosPromXRaza = connection.GetArray<EstadisticaPesoPromXRaza>("spReporteBovinoPesoPromedioPorRaza", parametros, System.Data.CommandType.StoredProcedure).ToList();
                obj.top10BovinosMasLivianos = connection.GetArray<EstadisticaTop10BovinosLivianos>("spReporteBovinoTop10BovinosMasLivianos", parametros, System.Data.CommandType.StoredProcedure).ToList();
                obj.inicio = connection.GetArray<EstadisticaBovinoInicio>("spGetInicioEstadisticaBovinos", parametros, System.Data.CommandType.StoredProcedure).FirstOrDefault();
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

        public EstadisticasInseminacion GetEstadisticaInseminacion(long codigoCampo, string periodo)
        {
            try
            {
                connection = new SqlServerConnection();
                var obj = new EstadisticasInseminacion();
                obj.inseminacionXCategoriaHembra = new List<EstadisticaInseminacionPorCategoria>();
                obj.inseminacionXCategoriaMacho = new List<EstadisticaInseminacionPorCategoria>();
                obj.inseminacionXRaza = new List<EstadisticaInseminacionPorRaza>();
                obj.inseminacionXTipo = new List<EstadisticaInseminacionPorTipo>();
                obj.inseminacionExitosaXToro = new List<EstadisticaInseminacionPorBovino>();
                obj.inseminacionFallidaXVaca = new List<EstadisticaInseminacionPorBovino>();
                obj.hijosXToro = new List<EstadisticaHijosPorBovino>();
                obj.hijosXVaca = new List<EstadisticaHijosPorBovino>();
                obj.abortosXVaca = new List<EstadisticaAbortosPorVaca>();
                var parametros = new Dictionary<string, object>{
                    { "@codigoCampo", codigoCampo },
                    { "@periodo", periodo }
                };
                obj.inseminacionXCategoriaHembra = connection.GetArray<EstadisticaInseminacionPorCategoria>("spReporteInseminacionPorCategoriaHembraEfectividad", parametros, System.Data.CommandType.StoredProcedure).ToList();
                obj.inseminacionXCategoriaMacho = connection.GetArray<EstadisticaInseminacionPorCategoria>("spReporteInseminacionPorCategoriaMachoEfectividad", parametros, System.Data.CommandType.StoredProcedure).ToList();
                obj.inseminacionXRaza = connection.GetArray<EstadisticaInseminacionPorRaza>("spReporteInseminacionPorRazaEfectividad", parametros, System.Data.CommandType.StoredProcedure).ToList();
                obj.inseminacionXTipo = connection.GetArray<EstadisticaInseminacionPorTipo>("spReporteInseminacionPorTipoEfectividad", parametros, System.Data.CommandType.StoredProcedure).ToList();
                obj.inseminacionExitosaXToro = connection.GetArray<EstadisticaInseminacionPorBovino>("spReporteInseminacionTorosInseminacionesExitosas", parametros, System.Data.CommandType.StoredProcedure).ToList();
                obj.inseminacionFallidaXVaca = connection.GetArray<EstadisticaInseminacionPorBovino>("spReporteInseminacionVacasInseminacionesFallidas", parametros, System.Data.CommandType.StoredProcedure).ToList();
                parametros = new Dictionary<string, object>{
                    { "@codigoCampo", codigoCampo }
                };
                obj.hijosXToro = connection.GetArray<EstadisticaHijosPorBovino>("spReporteInseminacionTorosMasHijos", parametros, System.Data.CommandType.StoredProcedure).ToList();
                obj.hijosXVaca = connection.GetArray<EstadisticaHijosPorBovino>("spReporteInseminacionVacasMasHijos", parametros, System.Data.CommandType.StoredProcedure).ToList();
                obj.abortosXVaca = connection.GetArray<EstadisticaAbortosPorVaca>("spReporteInseminacionVacasMasAbortos", parametros, System.Data.CommandType.StoredProcedure).ToList();
                obj.inicio = connection.GetArray<EstadisticaInseminacionInicio>("spGetInicioEstadisticaInseminacion", parametros, System.Data.CommandType.StoredProcedure).FirstOrDefault();
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

        public EstadisticasEvento GetEstadisticaEvento(long codigoCampo, string periodo)
        {
            try
            {
                connection = new SqlServerConnection();
                var obj = new EstadisticasEvento();
                obj.antibioticosMasUsados = new List<EstadisticaAntibioticoMasUsado>();
                obj.cambiosAlimentacionXBovino = new List<EstadisticaCambiosPorBovino>();
                obj.movimientosXBovino = new List<EstadisticaCambiosPorBovino>();
                obj.eventosXTipoXMes = new List<EstadisticaEventoPorTipoPorMes>();
                obj.eventosXTipoXGenero = new List<EstadisticaEventoPorTipoPorGenero>();
                obj.vacunasMenosUsadas = new List<EstadisticaVacunaMenosUsada>();
                var parametros = new Dictionary<string, object>{
                    { "@codigoCampo", codigoCampo },
                    { "@periodo", periodo },
                    { "@mes", 0 }
                }; for (int i = 1; i < 13; i++)
                {
                    parametros["@mes"] = i;
                    var aux = connection.GetArray<EstadisticaEventoPorTipoPorMes>("spReporteEventoCantidadPorTipoPorMes", parametros, System.Data.CommandType.StoredProcedure).FirstOrDefault();
                    obj.eventosXTipoXMes.Add(aux);
                }
                parametros = new Dictionary<string, object>{
                    { "@codigoCampo", codigoCampo },
                    { "@periodo", periodo }
                };
                obj.antibioticosMasUsados = connection.GetArray<EstadisticaAntibioticoMasUsado>("spReporteEventoAntibioticoMasUsado", parametros, System.Data.CommandType.StoredProcedure).ToList();
                obj.cambiosAlimentacionXBovino = connection.GetArray<EstadisticaCambiosPorBovino>("spReporteEventoBovinoMasCambiosAlimentacion", parametros, System.Data.CommandType.StoredProcedure).ToList();
                obj.movimientosXBovino = connection.GetArray<EstadisticaCambiosPorBovino>("spReporteEventoBovinoMasMovimientos", parametros, System.Data.CommandType.StoredProcedure).ToList();
                obj.eventosXTipoXGenero = connection.GetArray<EstadisticaEventoPorTipoPorGenero>("spReporteEventoTipoEventoSegunGenero", parametros, System.Data.CommandType.StoredProcedure).ToList();
                obj.vacunasMenosUsadas = connection.GetArray<EstadisticaVacunaMenosUsada>("spReporteEventoVacunasMenosUsadas", parametros, System.Data.CommandType.StoredProcedure).ToList();
                obj.top10Alimentos = connection.GetArray<EstadisticaTop10Alimentos>("spReporteEventoTop10Alimentos", parametros, System.Data.CommandType.StoredProcedure).ToList();
                parametros = new Dictionary<string, object>{
                    { "@codigoCampo", codigoCampo }
                };
                obj.inicio = connection.GetArray<EstadisticaEventoInicio>("spGetInicioEstadisticaInseminacion", parametros, System.Data.CommandType.StoredProcedure).FirstOrDefault();
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
