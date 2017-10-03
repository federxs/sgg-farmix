using Newtonsoft.Json;
using sgg_farmix_acceso_datos.DAOs;
using sgg_farmix_acceso_datos.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Http;

namespace sgg_farmix_api.Controllers
{
    public class EventoController : ApiController
    {
        private EventoManager EM = new EventoManager();

        [Route("api/Evento/GetListaEventos")]
        [HttpGet]
        public IEnumerable<EventosItem> GetList(string filtro)
        {
            try
            {
                var entity = JsonConvert.DeserializeObject<EventoFilter>(filtro);
                return EM.GetList(entity);
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(new HttpResponseMessage(HttpStatusCode.NotFound)
                {
                    Content = new StringContent(string.Format("Error: {0}", ex.Message)),
                    ReasonPhrase = (ex.GetType() == typeof(ArgumentException) ? ex.Message : "Get_Error")
                });
            }
        }

        [Route("api/Evento/Insert")]
        [HttpPost]
        public Evento Post(string evento, string lista)
        {
            try
            {
                var eve = JsonConvert.DeserializeObject<Evento>(evento);
                List<long> ids = new List<long>();
                var aux = "";
                for (int i = 0; i < lista.Count(); i++)
                {
                    if (lista.ElementAt(i) != ',')
                        aux = aux + lista.ElementAt(i);
                    else
                    {
                        ids.Add(long.Parse(aux));
                        aux = "";
                    }
                }
                ids.Add(long.Parse(aux));
                return EM.Insert(eve, ids);
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(new HttpResponseMessage(HttpStatusCode.NotFound)
                {
                    Content = new StringContent(string.Format("Error: {0}", ex.Message)),
                    ReasonPhrase = (ex.GetType() == typeof(ArgumentException) ? ex.Message : "Get_Error")
                });
            }
        }

        [Route("api/Evento/Get")]
        [HttpGet]
        public EventoDetalle Get(string idEvento)
        {
            try
            {
                var id = Regex.Replace(idEvento, @"[^\d]", "");
                return EM.GetEvento(Int64.Parse(id));
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(new HttpResponseMessage(HttpStatusCode.NotFound)
                {
                    Content = new StringContent(string.Format("Error: {0}", ex.Message)),
                    ReasonPhrase = (ex.GetType() == typeof(ArgumentException) ? ex.Message : "Get_Error")
                });
            }
        }

        [Route("api/Evento/initEvento")]
        [HttpGet]
        public Resultados InitEvento(string idEvento)
        {
            Resultados resultado = new Resultados();
            try
            {
                var id = Regex.Replace(idEvento, @"[^\d]", "");
                resultado.vacunas = new VacunaManager().GetList();
                resultado.tipoEvento = new TipoEventoManager().GetList();
                resultado.listaBovinos = EM.GetEvento(Int64.Parse(id));
                resultado.campos = new CampoManager().GetList();
                resultado.rodeos = new RodeoManager().GetList(resultado.listaBovinos.campoDestino);
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(new HttpResponseMessage(HttpStatusCode.NotFound)
                {
                    Content = new StringContent(string.Format("Error: {0}", ex.Message)),
                    ReasonPhrase = (ex.GetType() == typeof(ArgumentException) ? ex.Message : "Get_Error")
                });
            }
            return resultado;
        }

        [Route("api/Evento/GetEventoForModificacion")]
        [HttpGet]
        public Evento GetEventoForModificacion(string idEvento)
        {
            try
            {
                var id = Regex.Replace(idEvento, @"[^\d]", "");
                return EM.Get(Int64.Parse(id));
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(new HttpResponseMessage(HttpStatusCode.NotFound)
                {
                    Content = new StringContent(string.Format("Error: {0}", ex.Message)),
                    ReasonPhrase = (ex.GetType() == typeof(ArgumentException) ? ex.Message : "Get_Error")
                });
            }
        }

        [HttpPut]
        public Evento Put(string value, string lista)
        {
            try
            {
                var evento = JsonConvert.DeserializeObject<Evento>(value);
                List<long> ids = null;
                if (lista != null)
                {
                    ids = new List<long>();
                    var aux = "";
                    for (int i = 0; i < lista.Count(); i++)
                    {
                        if (lista.ElementAt(i) != ',')
                            aux = aux + lista.ElementAt(i);
                        else
                        {
                            ids.Add(long.Parse(aux));
                            aux = "";
                        }
                    }
                    ids.Add(long.Parse(aux));
                }
                return EM.Update(evento.idEvento, evento, ids);
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(new HttpResponseMessage(HttpStatusCode.NotFound)
                {
                    Content = new StringContent(string.Format("Error: {0}", ex.Message)),
                    ReasonPhrase = (ex.GetType() == typeof(ArgumentException) ? ex.Message : "Get_Error")
                });
            }
        }

        [Route("api/Evento/DeleteEvento")]
        [HttpPut]
        public void DeleteEvento(string idEvento)
        {
            try
            {
                var id = Regex.Replace(idEvento, @"[^\d]", "");
                EM.Delete(Int64.Parse(id));
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(new HttpResponseMessage(HttpStatusCode.NotFound)
                {
                    Content = new StringContent(string.Format("Error: {0}", ex.Message)),
                    ReasonPhrase = (ex.GetType() == typeof(ArgumentException) ? ex.Message : "Get_Error")
                });
            }
        }
    }
}