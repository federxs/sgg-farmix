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
                resultado.categorias = new CategoriaManager().GetList(Int64.Parse(campo));
                resultado.estados = new EstadoManager().GetList(Int64.Parse(campo));
                resultado.razas = new RazaManager().GetList(Int64.Parse(campo));
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
        [AutorizationToken]
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
        [Route("api/Bovino/existeIdCaravana/{idCaravana}/{codigoCampo}")]
        [HttpGet]
        [AutorizationToken]
        public string ValidarNroCaravana(string idCaravana, string codigoCampo)
        {
            try
            {
                var numero = Regex.Replace(idCaravana, @"[^\d]", "");
                var codCampo = Regex.Replace(codigoCampo, @"[^\d]", "");
                return BM.ValidarCaravana(Int64.Parse(numero), Int64.Parse(codCampo));
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
        public string ValidarNroCaravana1(string idCaravana, string codigoCampo)
        {
            try
            {
                var numero = Regex.Replace(idCaravana, @"[^\d]", "");
                var codCampo = Regex.Replace(codigoCampo, @"[^\d]", "");
                return BM.ValidarCaravana(Int64.Parse(numero), Int64.Parse(codCampo));
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

        [Route("api/Bovino/Delete")]
        [HttpPut]
        [AutorizationToken]
        public int Delete(long idBovino, long codigoCampo)
        {
            try
            {
                return BM.Borrar(idBovino, codigoCampo);
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
                resultado.categorias = new CategoriaManager().GetList(idCampo);
                resultado.estados = new EstadoManager().GetList(idCampo);
                resultado.razas = new RazaManager().GetList(idCampo);
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
        public void DeleteMuerte(string idBovino, string fechaMuerte, long codigoCampo)
        {
            try
            {
                var id = Regex.Replace(idBovino, @"[^\d]", "");
                BM.DeleteMuerte(Int64.Parse(id), fechaMuerte, codigoCampo);
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
        [AutorizationToken]
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
        [AutorizationToken]
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

        [Route("api/Bovino/verificarCantBovinosXAdmin")]
        [HttpGet]
        [AutorizationToken]
        public ResultadoValidacionCampo ValidarCantidadBovinos(long campo)
        {
            try
            {
                return BM.ValidarCantidadBovinos(campo);
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

        [Route("api/Bovino/registrarNacimientos")]
        [HttpPost]
        [AutorizationToken]
        public int RegistrarNacimiento(string fechaNacimiento, string listaMadres, string toro, string codigoCampo)
        {
            try
            {
                List<long> idsMadres = new List<long>();
                var aux = "";
                for (int i = 0; i < listaMadres.Count(); i++)
                {
                    if (listaMadres.ElementAt(i) != ',')
                        aux = aux + listaMadres.ElementAt(i);
                    else
                    {
                        idsMadres.Add(long.Parse(aux));
                        aux = "";
                    }
                }
                idsMadres.Add(long.Parse(aux));
                long idToro = 0;
                if (toro != null)
                    idToro = long.Parse(toro);
                var codCampo = long.Parse(codigoCampo);
                return BM.CreateNacimiento(fechaNacimiento, idsMadres, idToro, codCampo);
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

        [Route("api/Bovino/getDatosBovinoNacido")]
        [HttpGet]
        [AutorizationToken]
        public Bovino GetDatosBovinoNacido(long idNacimiento)
        {
            try
            {
                return BM.GetDatosBovinoNacido(idNacimiento);
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

        [Route("api/Bovino/BovinosExportarPDF")]
        [HttpGet]
        [AutorizationToken]
        public Documento ExportarBovinosPDF(string filtro)
        {
            try
            {
                var filtroDesearizado = JsonConvert.DeserializeObject<BovinoFilter>(filtro);
                return BM.BovinosExportarPDF(filtroDesearizado);
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

        [Route("api/Bovino/BovinosExportarExcel")]
        [HttpGet]
        [AutorizationToken]
        public Documento ExportarBovinosExcel(string filtro)
        {
            try
            {
                var filtroDesearizado = JsonConvert.DeserializeObject<BovinoFilter>(filtro);
                return BM.BovinosExportarExcel(filtroDesearizado);
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