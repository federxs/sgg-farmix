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
    public class BovinoController : ApiController
    {
        private BovinoManager BM = new BovinoManager();

        [Route("api/Bovino/initModificacion")]
        [HttpGet]
        public Resultados Get(string idBovino)
        {
            Resultados resultado = new Resultados();
            try
            {
                var id = Regex.Replace(idBovino, @"[^\d]", "");
                resultado.categorias = new CategoriaManager().GetList();
                resultado.estados = new EstadoManager().GetList(1);
                resultado.razas = new RazaManager().GetList();
                resultado.rodeos = new RodeoManager().GetList();
                resultado.establecimientos = new EstablecimientoOrigenManager().GetList();
                resultado.bovino = BM.Get(Int64.Parse(id));
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

        [Route("api/BovinoConsultar/getListaBovinos")]
        [HttpGet]
        public IEnumerable<BovinoItem> GetList(string filtro)
        {
            try
            {
                var filtroDesearizado = JsonConvert.DeserializeObject<BovinoFilter>(filtro);
                return BM.GetList(filtroDesearizado);
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
        public BovinoFilter GetFilter()
        {
            try
            {
                return null;
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
        
        [HttpPost]
        public Bovino Post([FromBody]Bovino bovino)
        {
            try
            {
                return BM.Create(bovino);
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
        public Bovino Put(string value)
        {
            try
            {
                var bovino = JsonConvert.DeserializeObject<Bovino>(value);
                return BM.Update(bovino.idBovino, bovino);
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

        public int Delete([FromBody] Bovino value)
        {
            try
            {
                return BM.Borrar(value.idBovino);
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

        [Route("api/Bovino/inicializar/{idAmbitoEstado}")]
        [HttpGet]
        public Resultados GetListas(long idAmbitoEstado)
        {
            Resultados resultado = new Resultados();
            try
            {
                resultado.categorias = new CategoriaManager().GetList();
                resultado.estados = new EstadoManager().GetList(idAmbitoEstado);
                resultado.razas = new RazaManager().GetList();
                resultado.rodeos = new RodeoManager().GetList();
                resultado.establecimientos = new EstablecimientoOrigenManager().GetList();
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

        [Route("api/Bovino/initDetalle")]
        [HttpGet]
        public BovinoDetalle GetDetalle(string idBovino)
        {
            try
            {
                var id = Regex.Replace(idBovino, @"[^\d]", "");
                return BM.GetDetalle(Int64.Parse(id));
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