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
    public class BovinoController : ApiController
    {
        private BovinoManager BM = new BovinoManager();

        [Route("api/Bovino/initModificacion")]
        [HttpGet]
        [AutorizationToken]
        public Resultados Get(string idBovino, string idCampo)
        {
            Resultados resultado = new Resultados();
            try
            {
                var id = Regex.Replace(idBovino, @"[^\d]", "");
                var campo = Regex.Replace(idCampo, @"[^\d]", "");
                resultado.categorias = new CategoriaManager().GetList();
                resultado.estados = new EstadoManager().GetList(1);
                resultado.razas = new RazaManager().GetList();
                resultado.rodeos = new RodeoManager().GetList(Int64.Parse(campo));
                resultado.establecimientos = new EstablecimientoOrigenManager().GetList(Int64.Parse(campo));
                resultado.alimentos = new AlimentoManager().GetList(Int64.Parse(campo));
                resultado.bovino = BM.Get(Int64.Parse(id), Int64.Parse(campo));
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
        [AutorizationToken]
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

        //este metodo sirve para la validacion del nro de caravana en la regitración
        [Route("api/Bovino/existeIdCaravana/{idCaravana}")]
        [HttpGet]
        [AutorizationToken]
        public string ValidarNroCaravana(string idCaravana)
        {
            try
            {
                var numero = Regex.Replace(idCaravana, @"[^\d]", "");
                return BM.ValidarCaravana(Int64.Parse(numero));
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

        //este metodo sirve para la validacion del nro de caravana en la modificacion
        [Route("api/Bovino/existeIdCaravana")]
        [HttpGet]
        [AutorizationToken]
        public string ValidarNroCaravana1(string idCaravana)
        {
            try
            {
                var numero = Regex.Replace(idCaravana, @"[^\d]", "");
                return BM.ValidarCaravana(Int64.Parse(numero));
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
        [AutorizationToken]
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
        [AutorizationToken]
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

        [Route("api/Bovino/inicializar/{idAmbitoEstado}/{idCampo}")]
        [HttpGet]
        [AutorizationToken]
        public Resultados GetListas(long idAmbitoEstado, long idCampo)
        {
            Resultados resultado = new Resultados();
            try
            {
                resultado.categorias = new CategoriaManager().GetList();
                resultado.estados = new EstadoManager().GetList(idAmbitoEstado);
                resultado.razas = new RazaManager().GetList();
                resultado.rodeos = new RodeoManager().GetList(idCampo);
                resultado.alimentos = new AlimentoManager().GetList(idCampo);
                resultado.establecimientos = new EstablecimientoOrigenManager().GetList(idCampo);
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
        [AutorizationToken]
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

        [Route("api/Bovino/initBaja")]
        [HttpGet]
        [AutorizationToken]
        public BovinoHeaderEliminar GetBaja(string idBovino, string codigoCampo)
        {
            try
            {
                var id = Regex.Replace(idBovino, @"[^\d]", "");
                var campo = Regex.Replace(codigoCampo, @"[^\d]", "");
                var bovino = BM.GetDetalleBaja(Int64.Parse(id));
                Resultados resultado = new Resultados();
                resultado.establecimientos = new EstablecimientoOrigenManager().GetList(Int64.Parse(campo));
                bovino.establecimientosDestino = resultado;
                return bovino;
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

        [Route("api/Bovino/darBajaMuerte")]
        [HttpPut]
        [AutorizationToken]
        public void DeleteMuerte(string idBovino, string fechaMuerte)
        {
            try
            {
                var id = Regex.Replace(idBovino, @"[^\d]", "");
                BM.DeleteMuerte(Int64.Parse(id), fechaMuerte);
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

        [Route("api/Bovino/darBajaVenta")]
        [HttpPost]
        [AutorizationToken]
        public void DeleteVenta(string venta)
        {
            try
            {
                var vta = JsonConvert.DeserializeObject<Venta>(venta);
                BM.DeleteVenta(vta);
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

        [Route("api/Bovino/getListaTags")]
        [HttpGet]
        public IEnumerable<TagBovino> GetTagsBovinos(string idCampo)
        {
            try
            {
                var codigoCampo = Regex.Replace(idCampo, @"[^\d]", "");
                return BM.GetTags(Int64.Parse(codigoCampo));
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

        [Route("api/Bovino/escribirTag")]
        [HttpPut]
        public bool EscribirTag(string idBovino)
        {
            try
            {
                var id = Regex.Replace(idBovino, @"[^\d]", "");
                return BM.EscribirTag(long.Parse(idBovino));
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

        [Route("api/Bovino/cargarProvinciasAndLoc")]
        [HttpGet]
        [AutorizationToken]
        public Resultados GetProvinciasAndLoc()
        {
            try
            {
                Resultados result = new Resultados();
                result.provincias = BM.GetProvincias();
                result.localidades = BM.GetLocalidades();
                return result;
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