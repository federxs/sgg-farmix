using Newtonsoft.Json;
using sgg_farmix_acceso_datos.DAOs;
using sgg_farmix_acceso_datos.Model;
using sgg_farmix_helper;
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
    public class InseminacionController : ApiController
    {
        private InseminacionManager IM = new InseminacionManager();

        [Route("api/Inseminacion/Insert")]
        [HttpPost]
        [AutorizationToken]
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
        [AutorizationToken]
        public InseminacionInit InitPantallaInseminacion(string idCampo, string periodo)
        {
            try
            {
                var id = Regex.Replace(idCampo, @"[^\d]", "");
                return IM.GetInicioInseminacion(Int64.Parse(id), periodo);
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
        [AutorizationToken]
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
        [AutorizationToken]
        public IEnumerable<ServSinConfirmar> GetServiciosSinConfirmar(string idCampo, string periodo)
        {
            try
            {
                var id = Regex.Replace(idCampo, @"[^\d]", "");
                return IM.GetServiciosSinConfirmar(Int64.Parse(id), periodo);
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
        [AutorizationToken]
        public IEnumerable<ServSinConfirmar> GetInseminacionesXFechaInsem(string idCampo)
        {
            try
            {
                var id = Regex.Replace(idCampo, @"[^\d]", "");
                return IM.GetInseminacionesXFechaInsem(Int64.Parse(id));
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
        [AutorizationToken]
        public IEnumerable<PreniadasXParir> GetPreniadasPorParir(string idCampo, string periodo)
        {
            try
            {
                var id = Regex.Replace(idCampo, @"[^\d]", "");
                return IM.GetPreniadasPorParir(Int64.Parse(id), periodo);
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

        [Route("api/Inseminacion/Lactancias")]
        [HttpGet]
        [AutorizationToken]
        public IEnumerable<BovinoItem> VacasDandoLactar()
        {
            try
            {
                return IM.GetVacasLactancia();
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

        [HttpGet]
        [AutorizationToken]
        public InseminacionDetalle Get(string fechaInseminacion, int tipoInseminacion)
        {
            try
            {
                return IM.GetInseminacion(fechaInseminacion, tipoInseminacion);
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

        //este metodo se usa para actualizar las inseminaciones que aun no tiene tacto realizado
        [HttpPut]
        [AutorizationToken]
        public Inseminacion Put(string value, string listaVacas, string listaToros, string fechaAnterior)
        {
            try
            {
                var inseminacion = JsonConvert.DeserializeObject<Inseminacion>(value);
                List<long> ids = null;
                if (listaVacas != null)
                {
                    ids = new List<long>();
                    var aux = "";
                    for (int i = 0; i < listaVacas.Count(); i++)
                    {
                        if (listaVacas.ElementAt(i) != ',')
                            aux = aux + listaVacas.ElementAt(i);
                        else
                        {
                            ids.Add(long.Parse(aux));
                            aux = "";
                        }
                    }
                    ids.Add(long.Parse(aux));
                }
                List<long> idsToros = null;
                if (listaToros != null)
                {
                    idsToros = new List<long>();
                    var aux = "";
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
                return IM.Update(inseminacion, ids, idsToros, fechaAnterior);
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

        //este metodo se usa para actualizar una inseminacion que ya tuvo un tacto exitoso
        [Route("api/Inseminacion/Update")]
        [HttpPut]
        [AutorizationToken]
        public Inseminacion Update(string value, string tacto)
        {
            try
            {
                var inseminacion = JsonConvert.DeserializeObject<Inseminacion>(value);
                var objTacto = JsonConvert.DeserializeObject<Tacto>(tacto);
                new TactoManager().Update(0, objTacto);
                return IM.Update(inseminacion.idInseminacion, inseminacion);
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

        [Route("api/Inseminacion/DeleteInseminacion")]
        [HttpPut]
        [AutorizationToken]
        public void DeleteInseminacion(string parametro)
        {
            try
            {
                IM.Delete(parametro);
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