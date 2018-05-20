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
    public class EventoManager : IManager<Evento>
    {
        private SqlServerConnection connection;
        public Evento Create(Evento entity)
        {
            throw new NotImplementedException();
        }

        public void Delete(long id)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@idEvento", id }
                };
                var delete = connection.Execute("spEliminarEvento", parametros, System.Data.CommandType.StoredProcedure);
                if (delete == 0)
                    throw new ArgumentException("Delete Evento Error");
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

        public IEnumerable<Evento> Get(Evento entity)
        {
            throw new NotImplementedException();
        }

        public Evento Get(long id)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@idEvento", id }
                };
                var evento = connection.GetArray<Evento>("spObtenerDatosEvento", parametros, System.Data.CommandType.StoredProcedure).FirstOrDefault();
                return evento;
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

        public Evento GetFilter()
        {
            throw new NotImplementedException();
        }

        public Evento Update(long id, Evento entity)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<EventosItem> GetList(EventoFilter filter)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@idTipoEvento", filter.idTipoEvento },
                    {"@fechaDesde", filter.fechaDesde },
                    {"@fechaHasta", filter.fechaHasta },
                    {"@idCampo", filter.codigoCampo }
                };
                if (filter.numCaravana != 0)
                    parametros.Add("@numCaravana", filter.numCaravana);
                var lista = connection.GetArray<EventosItem>("spObtenerListaEventos", parametros, System.Data.CommandType.StoredProcedure);
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

        public Evento Insert(Evento evento, List<long> lista)
        {
            connection = new SqlServerConnection();
            DbTransaction transaction = connection.BeginTransaction();
            try
            {
                var parametrosEvento = new Dictionary<string, object>
                {
                    {"@cant", evento.cantidad },
                    {"@idTipoEvento", evento.idTipoEvento }
                };
                switch (evento.idTipoEvento)
                {
                    case 1: //vacunacion
                        parametrosEvento.Add("@idVacuna", evento.idVacuna);
                        break;
                    case 2: //antibiotico
                        parametrosEvento.Add("@idAntibiotico", evento.idAntibiotico);
                        break;
                    case 3: //manejo
                        parametrosEvento.Add("@codigoCampo", evento.idCampoDestino);
                        parametrosEvento.Add("@idRodeoDestino", evento.idRodeoDestino);
                        break;
                    case 4: //alimenticio
                        parametrosEvento.Add("@idAlimento", evento.idAlimento);
                        break;
                }
                evento.idEvento = connection.Execute("spRegistrarEvento", parametrosEvento, System.Data.CommandType.StoredProcedure, transaction);
                if (evento.idEvento == 0)
                    throw new ArgumentException("Create Evento Error");
                var parametrosDetalle = new Dictionary<string, object>()
                {
                    {"@idEvento", evento.idEvento },
                    {"@idTipoEvento", evento.idTipoEvento }
                };
                switch (evento.idTipoEvento)
                {
                    case 3: //manejo
                        parametrosEvento.Add("@idRodeoDestino", evento.idRodeoDestino);
                        break;
                    case 4: //alimenticio
                        parametrosEvento.Add("@idAlimento", evento.idAlimento);
                        break;
                }
                var insert = 0;
                parametrosDetalle.Add("@idBovino", 0);
                for (int i = 0; i < lista.Count; i++)
                {
                    parametrosDetalle["@idBovino"] = lista.ElementAt(i);
                    insert = connection.Execute("spRegistrarEventosXBovino", parametrosDetalle, System.Data.CommandType.StoredProcedure, transaction);
                    if (insert == 0)
                        throw new ArgumentException("Create EventosXBovino Error");
                }
                if (evento.idTipoEvento == 3)
                {
                    insert = 0;
                    var parametros = new Dictionary<string, object>
                    {
                        {"@idRodeo", evento.idRodeoDestino },
                        {"@idBovino", 0 }
                    };
                    for (int i = 0; i < lista.Count; i++)
                    {
                        parametros["@idBovino"] = lista.ElementAt(i);
                        insert = connection.Execute("spActualizarRodeoBovino", parametros, System.Data.CommandType.StoredProcedure, transaction);
                        if (insert == 0)
                            throw new ArgumentException("Update rodeo bovino Error");
                    }
                }
                connection.Commit(transaction);
                return evento;
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

        public EventoDetalle GetEvento(long id)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@idEvento", id }
                };
                var evento = connection.GetArray<EventoDetalle>("spGetEvento", parametros, System.Data.CommandType.StoredProcedure).FirstOrDefault();
                evento.listaBovinos = connection.GetArray<BovinoItem>("spObtenerEventosXBovino", parametros, System.Data.CommandType.StoredProcedure).ToList();
                return evento;
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

        public Evento Update(long id, Evento entity, List<long> lista)
        {
            connection = new SqlServerConnection();
            DbTransaction transaction = connection.BeginTransaction();
            try
            {
                if (lista == null)
                {
                    var param = new Dictionary<string, object>
                    {
                        {"@idEvento", id }
                    };
                    connection.Execute("spDeleteDetalleXBovino", param, System.Data.CommandType.StoredProcedure, transaction);
                    var delete = connection.Execute("spEliminarEvento", param, System.Data.CommandType.StoredProcedure, transaction);
                    if (delete == 0)
                        throw new ArgumentException("Delete Evento Error");
                }
                else
                {
                    var parametrosEvento = new Dictionary<string, object>
                    {
                        {"@idEvento", id },
                        {"@idTipoEvento", entity.idTipoEvento },
                        {"@fechaHora", entity.fechaHora },
                        {"@cantidad", entity.cantidad }
                    };
                    switch (entity.idTipoEvento)
                    {
                        case 1:
                            parametrosEvento.Add("@idVacuna", entity.idVacuna);
                            break;
                        case 2:
                            parametrosEvento.Add("@idAntibiotico", entity.idAntibiotico);
                            break;
                        case 3:
                            parametrosEvento.Add("@idCampoDestino", entity.idCampoDestino);
                            parametrosEvento.Add("@idRodeoDestino", entity.idRodeoDestino);
                            break;
                        case 4:
                            parametrosEvento.Add("@idAlimento", entity.idAlimento);
                            break;
                    }
                    var update = connection.Execute("spModificarEvento", parametrosEvento, System.Data.CommandType.StoredProcedure, transaction);
                    if (update == 0)
                        throw new ArgumentException("Update evento error");
                    var parametrosDetalle = new Dictionary<string, object>
                    {
                        {"@idEvento", id }
                    };
                    connection.Execute("spDeleteDetalleXBovino", parametrosDetalle, System.Data.CommandType.StoredProcedure, transaction);
                    var insertDetalle = 0;
                    parametrosDetalle.Add("@idBovino", 0);
                    for (int i = 0; i < lista.Count; i++)
                    {
                        parametrosDetalle["@idBovino"] = lista.ElementAt(i);
                        insertDetalle = connection.Execute("spRegistrarEventosXBovino", parametrosDetalle, System.Data.CommandType.StoredProcedure, transaction);
                        if (insertDetalle == 0)
                            throw new ArgumentException("Update EventosXBovino Error");
                    }
                    if (entity.idTipoEvento == 3)
                    {
                        var insert = 0;
                        var parametros = new Dictionary<string, object>
                        {
                            {"@idRodeo", entity.idRodeoDestino },
                            {"@idBovino", 0 }
                        };
                        for (int i = 0; i < lista.Count; i++)
                        {
                            parametros["@idBovino"] = lista.ElementAt(i);
                            insert = connection.Execute("spActualizarRodeoBovino", parametros, System.Data.CommandType.StoredProcedure, transaction);
                            if (insert == 0)
                                throw new ArgumentException("Update rodeo bovino Error");
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
    }
}
