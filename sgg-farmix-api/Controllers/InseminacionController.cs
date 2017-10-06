using Newtonsoft.Json;
using sgg_farmix_acceso_datos.DAOs;
using sgg_farmix_acceso_datos.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace sgg_farmix_api.Controllers
{
    public class InseminacionController : ApiController
    {
        private InseminacionManager IM = new InseminacionManager();

        [Route("api/Inseminacion/Insert")]
        [HttpPost]
        public Inseminacion Post(string inseminacion, string listaVacas, string listaToros)
        {
            try
            {
                var insem = JsonConvert.DeserializeObject<Inseminacion>(inseminacion);
                List<long> idsVacas = new List<long>();
                var aux = "";
                for (int i = 0; i < listaVacas.Count(); i++)
                {
                    if (listaVacas.ElementAt(i) != ',')
                        aux = aux + listaVacas.ElementAt(i);
                    else
                    {
                        idsVacas.Add(long.Parse(aux));
                        aux = "";
                    }
                }
                idsVacas.Add(long.Parse(aux));
                List<long> idsToros = null;
                if (listaToros != null)
                {
                    idsToros = new List<long>();
                    aux = "";
                    for (int i = 0; i < listaToros.Count(); i++)
                    {
                        if (listaToros.ElementAt(i) != ',')
                            aux = aux + listaToros.ElementAt(i);
                        else
                        {
                            idsToros.Add(long.Parse(aux));
                            aux = "";
                        }
                    }
                    idsToros.Add(long.Parse(aux));
                }
                return IM.Insert(insem, idsVacas, idsToros);
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

        [Route("api/Inseminacion/Init")]
        [HttpGet]
        public InseminacionInit InitPantallaInseminacion()
        {
            try
            {
                return IM.GetInicioInseminacion();
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

        [Route("api/Inseminacion/HembrasServicio")]
        [HttpGet]
        public IEnumerable<BovinoItem> HembrasServicio()
        {
            try
            {
                return IM.GetHembrasServicio();
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

        [Route("api/Inseminacion/ServicioSinConfirmar")]
        [HttpGet]
        public IEnumerable<ServSinConfirmar> GetServiciosSinConfirmar()
        {
            try
            {
                return IM.GetServiciosSinConfirmar();
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

        [Route("api/Inseminacion/GetInseminacionesAgrupadasXFechaInsem")]
        [HttpGet]
        public IEnumerable<ServSinConfirmar> GetInseminacionesXFechaInsem()
        {
            try
            {
                return IM.GetInseminacionesXFechaInsem();
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

        [Route("api/Inseminacion/PreniadasPorParir")]
        [HttpGet]
        public IEnumerable<PreniadasXParir> GetPreniadasPorParir()
        {
            try
            {
                return IM.GetPreniadasPorParir();
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