using sgg_farmix_acceso_datos.Helper;
using sgg_farmix_acceso_datos.Model;
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

        public Inseminacion Insert(Inseminacion entity, List<long> listVacas, List<long> listToros)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@tipoInseminacion", entity.tipoInseminacion },
                    {"@idVaca", 0 }
                };
                for (int i = 0; i < listVacas.Count; i++)
                {
                    parametros["@idVaca"] = listVacas.ElementAt(i);
                    var inseminacion = connection.Execute("spRegistrarInseminacion", parametros, System.Data.CommandType.StoredProcedure);
                    if (inseminacion == 0)
                        throw new ArgumentException("Create Inseminacion Error");
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
            }
        }

        public InseminacionInit GetInicioInseminacion()
        {
            try
            {
                connection = new SqlServerConnection();
                var obj = connection.GetArray<InseminacionInit>("spGetInicioInseminacion", null, System.Data.CommandType.StoredProcedure).FirstOrDefault();
                return obj;
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
            }
        }

        public IEnumerable<ServSinConfirmar> GetServiciosSinConfirmar()
        {
            try
            {
                connection = new SqlServerConnection();
                var lista = connection.GetArray<ServSinConfirmar>("spGetListServSinConfirmar", null, System.Data.CommandType.StoredProcedure);
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

        public IEnumerable<ServSinConfirmar> GetInseminacionesXFechaInsem()
        {
            try
            {
                connection = new SqlServerConnection();
                var lista = connection.GetArray<ServSinConfirmar>("spGetListInseminacionesXFecha", null, System.Data.CommandType.StoredProcedure);
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

        public IEnumerable<PreniadasXParir> GetPreniadasPorParir()
        {
            try
            {
                connection = new SqlServerConnection();
                var lista = connection.GetArray<PreniadasXParir>("spGetListPreniadasXParir", null, System.Data.CommandType.StoredProcedure);
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

        public InseminacionDetalle GetInseminacion(string fecha)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@fechaInseminacion", fecha }
                };
                var inseminacion = connection.GetArray<InseminacionDetalle>("spObtenerDatosInseminacion", parametros, System.Data.CommandType.StoredProcedure).FirstOrDefault();
                inseminacion.listaBovinos = connection.GetArray<BovinoItem>("spObtenerBovinosXInseminacion", parametros, System.Data.CommandType.StoredProcedure).ToList();
                if (inseminacion.fechaEstimadaNacimiento != "")
                {
                    parametros = new Dictionary<string, object>
                    {
                        {"@idInseminacion", inseminacion.idInseminacion }
                    };
                    inseminacion.tactos = connection.GetArray<Tacto>("spObtenerTactosXInseminacion", parametros, System.Data.CommandType.StoredProcedure);
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
            }
        }

        public Inseminacion Update(Inseminacion entity, List<long> lista, string fechaInseminacionAnterior)
        {
            connection = new SqlServerConnection();
            DbTransaction transaction = connection.BeginTransaction();
            try
            {
                if (lista == null)
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
                    //for (int i = 0; i < lista.Count; i++)
                    //{
                    var update = connection.Execute("spDeleteInseminacion", parametrosInseminacion, System.Data.CommandType.StoredProcedure, transaction);
                    if (update == 0)
                        throw new ArgumentException("Update Inseminacion Error");
                    //}
                    var parametros = new Dictionary<string, object>
                    {
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
            }
        }
    }
}
