using sgg_farmix_acceso_datos.Helper;
using sgg_farmix_acceso_datos.Model;
using sgg_farmix_helper;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace sgg_farmix_acceso_datos.DAOs
{
    public class InseminacionManager : IManager<Inseminacion>
    {
        private SqlServerConnection connection;
        public Inseminacion Create(Inseminacion entity)
        {
            throw new NotImplementedException();
        }

        public void Delete(long id)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<Inseminacion> Get(Inseminacion entity)
        {
            throw new NotImplementedException();
        }

        public Inseminacion Get(long id)
        {
            throw new NotImplementedException();
        }

        public Inseminacion GetFilter()
        {
            throw new NotImplementedException();
        }

        public Inseminacion Update(long id, Inseminacion entity)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@idInseminacion", id },
                    {"@fechaInseminacion", entity.fechaInseminacion },
                    {"@idTipoInseminacion", entity.tipoInseminacion },
                    {"@fechaEstimadaNacimiento", entity.fechaEstimadaNacimiento }
                };
                var update = connection.Execute("spUpdateInseminacionExitosa", parametros, System.Data.CommandType.StoredProcedure);
                if (update == 0)
                    throw new ArgumentException("Update Inseminacion Error");
                if (entity.idToro != 0)
                {
                    parametros = new Dictionary<string, object>()
                    {
                        {"@idInseminacion", id },
                        {"@idToro", entity.idToro }
                    };
                    update = connection.Execute("UpdateToroXInseminacionExitosa", parametros, System.Data.CommandType.StoredProcedure);                    
                }
                else {
                    parametros = new Dictionary<string, object>()
                    {
                        {"@fechaInseminacion", entity.fechaInseminacion }
                    };
                    update = connection.Execute("spDeleteTorosXInseminacion", parametros, System.Data.CommandType.StoredProcedure);
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

        public Inseminacion Insert(Inseminacion entity, List<long> listVacas, List<long> listToros)
        {
            connection = new SqlServerConnection();
            DbTransaction transaction = connection.BeginTransaction();
            try
            {
                var parametros = new Dictionary<string, object>
                {
                    {"@tipoInseminacion", entity.tipoInseminacion },
                    {"@idVaca", 0 },
                    {"@fechaHora", entity.fechaInseminacion },
                    {"@codigoCampo", entity.codigoCampo }
                };
                for (int i = 0; i < listVacas.Count; i++)
                {
                    parametros["@idVaca"] = listVacas.ElementAt(i);
                    entity.idInseminacion = connection.Execute("spRegistrarInseminacion", parametros, System.Data.CommandType.StoredProcedure, transaction);
                    //Si devuelvo un -1 como idInseminacion, esto significa que se inserto una inseminacion conflictiva
                    if (entity.idInseminacion == 0)
                        throw new ArgumentException("Create Inseminacion Error");
                    if (listToros != null && entity.tipoInseminacion == 2)
                    {
                        var parametrosToros = new Dictionary<string, object>
                        {
                            {"@idInseminacion", entity.idInseminacion },
                            {"@idToro", 0 }
                        };
                        //if (listToros.Count == 1)
                        for (int j = 0; j < listToros.Count; j++)
                        {
                            parametrosToros["@idToro"] = listToros.ElementAt(j);
                            var insert = connection.Execute("spRegistrarToroXInseminacion", parametrosToros, System.Data.CommandType.StoredProcedure, transaction);
                            if (insert == 0)
                                throw new ArgumentException("Create Inseminacion Error");
                        }
                    }
                }
                connection.Commit(transaction);
                return entity;
            }
            catch (Exception ex)
            {
                connection.Rollback(transaction);
                throw;
            }
            finally
            {
                connection.Close();
                connection = null;
                transaction = null;
            }
        }

        public InseminacionInit GetInicioInseminacion(long id)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@idCampo", id }
                };
                var obj = connection.GetArray<InseminacionInit>("spGetInicioInseminacion", parametros, System.Data.CommandType.StoredProcedure).FirstOrDefault();
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

        public IEnumerable<BovinoItem> GetHembrasServicio()
        {
            try
            {
                connection = new SqlServerConnection();
                var lista = connection.GetArray<BovinoItem>("spGetHembrasServicio", null, System.Data.CommandType.StoredProcedure);
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

        public IEnumerable<ServSinConfirmar> GetServiciosSinConfirmar(long idCampo)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@idCampo", idCampo }
                };
                var lista = connection.GetArray<ServSinConfirmar>("spGetListServSinConfirmar", parametros, System.Data.CommandType.StoredProcedure);
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

        public IEnumerable<ServSinConfirmar> GetInseminacionesXFechaInsem(long id)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@idCampo", id }
                };
                var lista = connection.GetArray<ServSinConfirmar>("spGetListInseminacionesXFecha", parametros, System.Data.CommandType.StoredProcedure);
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

        public IEnumerable<PreniadasXParir> GetPreniadasPorParir(long idCampo)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@codigoCampo", idCampo }
                };
                var lista = connection.GetArray<PreniadasXParir>("spGetListPreniadasXParir", parametros, System.Data.CommandType.StoredProcedure);
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

        public InseminacionDetalle GetInseminacion(string fecha, int tipoInseminacion)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@fechaInseminacion", fecha },
                    {"@idTipoInseminacion", tipoInseminacion }
                };
                var inseminacion = connection.GetArray<InseminacionDetalle>("spObtenerDatosInseminacion", parametros, System.Data.CommandType.StoredProcedure).FirstOrDefault();                
                inseminacion.listaBovinos = connection.GetArray<BovinoItem>("spObtenerBovinosXInseminacion", parametros, System.Data.CommandType.StoredProcedure).ToList();
                parametros.Remove("@idTipoInseminacion");
                if (inseminacion.fechaEstimadaNacimiento != "")
                {
                    parametros = new Dictionary<string, object>
                    {
                        {"@idInseminacion", inseminacion.idInseminacion }
                    };
                    inseminacion.tactos = connection.GetArray<Tacto>("spObtenerTactosXInseminacion", parametros, System.Data.CommandType.StoredProcedure);
                }
                if (inseminacion.idTipoInseminacion == 2)
                {
                    parametros = new Dictionary<string, object>
                    {
                        {"@idInseminacion", inseminacion.idInseminacion }
                    };
                    inseminacion.listaToros = connection.GetArray<BovinoItem>("spObtenerListaTorosXInseminacion", parametros, System.Data.CommandType.StoredProcedure);
                }
                return inseminacion;
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

        public IEnumerable<BovinoItem> GetVacasLactancia()
        {
            try
            {
                connection = new SqlServerConnection();
                var lista = connection.GetArray<BovinoItem>("spGetVacasLactancias", null, System.Data.CommandType.StoredProcedure);
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

        public Inseminacion Update(Inseminacion entity, List<long> lista, List<long> listaToros, string fechaInseminacionAnterior)
        {
            connection = new SqlServerConnection();
            DbTransaction transaction = connection.BeginTransaction();
            try
            {
                if (lista == null && listaToros == null)
                {
                    var parametrosInseminacion = new Dictionary<string, object>
                    {
                        {"@fechaInsemOriginal", fechaInseminacionAnterior }
                    };
                    var delete = connection.Execute("spBorrarLogicoInseminacion", parametrosInseminacion, System.Data.CommandType.StoredProcedure, transaction);
                    if (delete == 0)
                        throw new ArgumentException("Update Inseminacion Error");
                }
                else
                {
                    var parametrosInseminacion = new Dictionary<string, object>
                    {
                        {"@fechaInsemOriginal", fechaInseminacionAnterior },
                    };
                    var update = connection.Execute("spDeleteInseminacion", parametrosInseminacion, System.Data.CommandType.StoredProcedure, transaction);
                    if (update == 0)
                        throw new ArgumentException("Update Inseminacion Error");
                    var parametros = new Dictionary<string, object>
                    {
                        {"@fechaInsemOriginal", fechaInseminacionAnterior },
                        {"@fechaInseminacion", entity.fechaInseminacion },
                        {"@idTipoInseminacion", entity.tipoInseminacion },
                        {"@idVaca", 0 }
                    };
                    for (int i = 0; i < lista.Count; i++)
                    {
                        parametros["@idVaca"] = lista.ElementAt(i);
                        update = connection.Execute("spUpdateInseminacion", parametros, System.Data.CommandType.StoredProcedure, transaction);
                        if (update == 0)
                            throw new ArgumentException("Update Inseminacion Error");
                    }
                    if (entity.tipoInseminacion == 2 && listaToros.Count() > 0)
                    {
                        var parametrosToros = new Dictionary<string, object>()
                        {
                            {"@fechaInseminacion", entity.fechaInseminacion  }
                        };
                        var delete = connection.Execute("spDeleteTorosXInseminacion", parametrosToros, System.Data.CommandType.StoredProcedure, transaction);
                        parametrosToros.Add("@idToro", 0);
                        for (int i = 0; i < listaToros.Count; i++)
                        {
                            parametrosToros["@idToro"] = listaToros.ElementAt(i);
                            update = connection.Execute("spUpdateToroXInseminacion", parametrosToros, System.Data.CommandType.StoredProcedure, transaction);
                            if (update == 0)
                                throw new ArgumentException("Update Inseminacion Error");
                        }
                    }
                    else if (listaToros == null)
                    {
                        var parametrosToros = new Dictionary<string, object>()
                        {
                            {"@fechaInseminacion", entity.fechaInseminacion  }
                        };
                        var delete = connection.Execute("spDeleteTorosXInseminacion", parametrosToros, System.Data.CommandType.StoredProcedure, transaction);
                    }
                }
                connection.Commit(transaction);
                return entity;
            }
            catch (Exception ex)
            {
                connection.Rollback(transaction);
                throw;
            }
            finally
            {
                connection.Close();
                connection = null;
                transaction = null;
            }
        }

        public void Delete(string parametro)
        {
            try
            {
                connection = new SqlServerConnection();
                long result;
                var parametros = new Dictionary<string, object>();
                if (long.TryParse(parametro, out result))
                {
                    parametros.Add("@idInseminacion", long.Parse(parametro));
                    connection.Execute("spBorrarInseminacionXId", parametros, System.Data.CommandType.StoredProcedure);
                }
                else
                {
                    parametros.Add("@fechaInseminacion", parametro);
                    connection.Execute("spBorrarInseminacionXFecha", parametros, System.Data.CommandType.StoredProcedure);
                }
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
