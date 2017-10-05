using sgg_farmix_acceso_datos.Helper;
using sgg_farmix_acceso_datos.Model;
using System;
using System.Collections.Generic;
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
            throw new NotImplementedException();
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
    }
}
