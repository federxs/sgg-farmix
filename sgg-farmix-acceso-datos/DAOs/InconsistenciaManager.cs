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
    public class InconsistenciaManager : IManager<Inconsistencia>
    {
        private SqlServerConnection connection;
        public Inconsistencia Create(Inconsistencia entity)
        {
            throw new NotImplementedException();
        }

        public InconsistenciaResolver Create(InconsistenciaResolver entity)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>();
                if (entity.inseminacionAnterior != null && entity.inseminacionNueva != null && entity.inseminacionResultante != null)
                {
                    parametros.Add("@idInseminacionAnterior", entity.inseminacionAnterior.idInseminacion);
                    parametros.Add("@idInseminacionConflictiva", entity.inseminacionNueva.idInseminacion);
                    parametros.Add("@fechaInseminacion", entity.inseminacionResultante.fechaInseminacion);
                    parametros.Add("@tipoInseminacion", entity.inseminacionNueva.idTipoInseminacion);
                    var update = connection.Execute("spResolverInseminacionConflictiva", parametros, System.Data.CommandType.StoredProcedure);
                    if(entity.inseminacionNueva.idTipoInseminacion == 2)
                    {
                        var parametrosToro = new Dictionary<string, object>()
                        {
                            {"@idToro", 0 },
                            {"@idInseminacion", entity.inseminacionAnterior.idInseminacion }
                        };
                        for (int i = 0; i < entity.inseminacionNueva.listaBovinos.Count(); i++)
                        {
                            parametrosToro["@idToro"] = entity.inseminacionNueva.listaBovinos.ElementAt(i).idBovino;
                            update = connection.Execute("spActualizarTorosXInseminacionXConflicto", parametrosToro, System.Data.CommandType.StoredProcedure);
                        }
                    }
                }
                else if (entity.tactoAnterior != null && entity.tactoNuevo != null && entity.tactoResultante != null)
                {
                    parametros.Add("@idInseminacionAnterior", entity.tactoAnterior.idInseminacion);
                    parametros.Add("@idInseminacionConflictiva", entity.tactoNuevo.idInseminacion);
                    parametros.Add("@fechaTactoAnterior", entity.tactoAnterior.fechaTacto);
                    parametros.Add("@fechaTacto", entity.tactoResultante.fechaTacto);
                    parametros.Add("@exitoso", entity.tactoResultante.exitoso);
                    parametros.Add("@idTipoTacto", entity.tactoResultante.idTipoTacto);
                    var update = connection.Execute("spResolverTactoConflictivo", parametros, System.Data.CommandType.StoredProcedure);
                }
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

        public IEnumerable<Inconsistencia> Get(Inconsistencia entity)
        {
            throw new NotImplementedException();
        }

        public Inconsistencia Get(long id)
        {
            throw new NotImplementedException();
        }

        public Inconsistencia GetFilter()
        {
            throw new NotImplementedException();
        }

        public Inconsistencia Update(long id, Inconsistencia entity)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<Inconsistencia> GetList(InconsistenciaFilter filter)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@tipo", filter.tipo },
                    {"@estado", filter.estado },
                    {"@fechaDesde", filter.fechaDesde },
                    {"@fechaHasta", filter.fechaHasta },
                    {"@codigoCampo", filter.codigoCampo },
                    {"@periodo", filter.periodo }
                };
                var lista = connection.GetArray<Inconsistencia>("spObtenerListaInconsistencias", parametros, System.Data.CommandType.StoredProcedure);
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

        public InconsistenciaResolver Get(long idTacto, string fechaTacto, long idTactoConflic, string fechaTactoConfl, long idInsem, long idInsemConflic)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>();
                var obj = new InconsistenciaResolver();
                if (idTacto != 0 && idTactoConflic != 0 && fechaTacto != "" && fechaTactoConfl != "")
                {
                    parametros.Add("@idInseminacion", idTacto);
                    parametros.Add("@fechaTacto", fechaTacto);
                    obj.tactoAnterior = connection.GetArray<Tacto>("spObtenerDatosTacto", parametros, System.Data.CommandType.StoredProcedure).FirstOrDefault();
                    parametros = new Dictionary<string, object>();
                    parametros.Add("@idInseminacion", idTactoConflic);
                    parametros.Add("@fechaTacto", fechaTactoConfl);
                    obj.tactoNuevo = connection.GetArray<Tacto>("spObtenerDatosTactoConflictivo", parametros, System.Data.CommandType.StoredProcedure).FirstOrDefault();
                }
                else if (idInsem != 0 && idInsemConflic != 0)
                {
                    parametros.Add("@idInseminacion", idInsem);
                    obj.inseminacionAnterior = connection.GetArray<InseminacionDetalle>("spObtenerDatosInseminacionXId", parametros, System.Data.CommandType.StoredProcedure).FirstOrDefault();
                    if (obj.inseminacionAnterior.idTipoInseminacion == 2)
                        obj.inseminacionAnterior.listaBovinos = connection.GetArray<BovinoItem>("spObtenerListaTorosXInseminacion", parametros, System.Data.CommandType.StoredProcedure);
                    parametros = new Dictionary<string, object>();
                    parametros.Add("@idInseminacion", idInsemConflic);
                    obj.inseminacionNueva = connection.GetArray<InseminacionDetalle>("spObtenerDatosInseminacionConflictivaXId", parametros, System.Data.CommandType.StoredProcedure).FirstOrDefault();
                    if (obj.inseminacionNueva.idTipoInseminacion == 2)
                        obj.inseminacionNueva.listaBovinos = connection.GetArray<BovinoItem>("spObtenerListaTorosXInseminacionConflictiva", parametros, System.Data.CommandType.StoredProcedure);
                }
                //var lista = connection.GetArray<Inconsistencia>("spObtenerListaInconsistencias", parametros, System.Data.CommandType.StoredProcedure);
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
