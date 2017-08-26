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
    public class EventoManager : IManager<Evento>
    {
        private SqlServerConnection connection;
        public Evento Create(Evento entity)
        {
            throw new NotImplementedException();
        }

        public void Delete(long id)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<Evento> Get(Evento entity)
        {
            throw new NotImplementedException();
        }

        public Evento Get(long id)
        {
            throw new NotImplementedException();
        }

        public Evento GetFilter()
        {
            throw new NotImplementedException();
        }

        public Evento Update(long id, Evento entity)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<Evento> GetList(EventoFilter filter)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@numCaravana", filter.numCaravana },
                    {"@idTipoEvento", filter.idTipoEvento },
                    {"@fechaDesde", filter.fechaDesde },
                    {"@fechaHasta", filter.fechaHasta }
                };
                var lista = connection.GetArray<Evento>("spObtenerListaEventos", parametros, System.Data.CommandType.StoredProcedure);
                return lista;
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
                        parametrosEvento.Add("@idCampoDestino", evento.idCampoOrigen);
                        parametrosEvento.Add("@idCampoActual", evento.idCampoActual);
                        break;
                    case 4: //alimenticio
                        parametrosEvento.Add("@idAlimento", evento.idAlimento);
                        break;
                }
                evento.idEvento = connection.Execute("spRegistrarEvento", parametrosEvento, System.Data.CommandType.StoredProcedure, transaction);
                if(evento.idEvento == 0)
                    throw new ArgumentException("Create Evento Error");
                var parametrosDetalle = new Dictionary<string, object>()
                {
                    {"@idEvento", evento.idEvento }
                };
                var insert = 0;
                for (int i = 0; i < lista.Count; i++)
                {
                    parametrosDetalle.Add("@idBovino", lista.ElementAt(i));
                    insert = connection.Execute("spRegistrarEventosXBovino", parametrosDetalle, System.Data.CommandType.StoredProcedure, transaction);
                    if(insert == 0)
                        throw new ArgumentException("Create EventosXBovino Error");
                }
                connection.Commit(transaction);
                return evento;
            }
            catch (Exception ex)
            {
                connection.Rollback(transaction);
                return null;
            }
            finally
            {
                connection.Close();
            }
        }
    }
}
