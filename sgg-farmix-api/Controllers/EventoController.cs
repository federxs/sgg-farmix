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

        [Route("api/Evento/getListaEventos")]
        [HttpGet]
        public IEnumerable<Evento> GetList(string filtro)
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
                string patron = @"(?:- *)?\d+(?:\.\d+)?";
                Regex regex = new Regex(patron);
                foreach (Match item in regex.Matches(lista))
                {
                    ids.Add(long.Parse(item.ToString()));
                }
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
    }
}