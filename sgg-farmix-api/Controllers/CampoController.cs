using Newtonsoft.Json;
using sgg_farmix_acceso_datos.DAOs;
using sgg_farmix_acceso_datos.Model;
using sgg_farmix_helper;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace sgg_farmix_api.Controllers
{
    public class CampoController : ApiController
    {
        private CampoManager CM = new CampoManager();
        [HttpPost]
        [AutorizationToken]
        public async Task<Campo> Post()
        {
            try
            {
                if (!Request.Content.IsMimeMultipartContent())
                {
                    throw new HttpResponseException(HttpStatusCode.UnsupportedMediaType);
                }

                string root = HttpContext.Current.Server.MapPath("~/App_Data");
                var provider = new MultipartFormDataStreamProvider(root);

                try
                {
                    // Read the form data.
                    var result = await Request.Content.ReadAsMultipartAsync(provider);
                    if (result.FormData["campo"] == null)
                    {
                        throw new HttpResponseException(HttpStatusCode.BadRequest);
                    }
                    var campoObject = JsonConvert.DeserializeObject<Campo>(result.FormData["campo"]);

                    var campoNuevo = CM.Create(campoObject);

                    foreach (MultipartFileData file in provider.FileData)
                    {
                        var multimediaObject = new Multimedia
                        {
                            mulTipo = file.Headers.ContentType.MediaType.StartsWith("image", StringComparison.InvariantCulture) ? 1 : 2,
                            mulPath = $"{file.LocalFileName.Split('\\').Last()}.{ file.Headers.ContentType.MediaType.Split('/').Last()}",
                            idCampo = campoNuevo.idCampo
                        };
                        var newFileName = $"{campoNuevo.idCampo}_ImagenCampo.{file.Headers.ContentType.MediaType.Split('/').Last()}";
                        MoveFiles.MoveFilesToFolder(file.LocalFileName, newFileName, campoNuevo.idCampo.ToString());

                        multimediaObject.mulPath = newFileName;

                        new MultimediaManager().Create(multimediaObject);

                        Trace.WriteLine(file.Headers.ContentDisposition.FileName);
                        Trace.WriteLine("Server file path: " + file.LocalFileName);
                    }

                    return campoNuevo;
                }
                catch (Exception ex)
                {
                    throw;
                }
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

        [Route("api/Campo/GetList")]
        [HttpGet]
        [AutorizationToken]
        public IEnumerable<Campo> GetList(string usuario, long idRol)
        {
            try
            {
                return CM.GetList(usuario, idRol);
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

        [Route("api/Campo/validarCantCamposXUsuario")]
        [HttpGet]
        [AutorizationToken]
        public ResultadoValidacionCampo ValidarCantCamposUsuario(string usuario)
        {
            try
            {
                return CM.ValidarCantidadCampos(usuario);
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

        [Route("api/Campo/GetInconsistencias")]
        [HttpGet]
        [AutorizationToken]
        public ResultadoValidacion GetInconsistencias(long codigoCampo)
        {
            try
            {
                return CM.GetInconsistencias(codigoCampo);
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

        [Route("api/Campo/GetToros")]
        [HttpGet]
        [AutorizationToken]
        public IEnumerable<BovinoItem> GetToros(long codigoCampo)
        {
            try
            {
                return CM.GetToros(codigoCampo);
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

        [Route("api/Campo/GetNacimientos")]
        [HttpGet]
        [AutorizationToken]
        public IEnumerable<NacimientoItem> GetNacimientos(string filtro)
        {
            try
            {
                var filtroDesearizado = JsonConvert.DeserializeObject<NacimientoFilter>(filtro);
                return CM.GetNacimientos(filtroDesearizado);
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

        [Route("api/Campo/NacimientosExportarPDF")]
        [HttpGet]
        [AutorizationToken]
        public Documento ExportarNacimientosPDF(string filtro)
        {
            try
            {
                var filtroDesearizado = JsonConvert.DeserializeObject<NacimientoFilter>(filtro);
                return new CampoManager().NacimientosExportarPDF(filtroDesearizado);
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

        [Route("api/Campo/NacimientosExportarExcel")]
        [HttpGet]
        [AutorizationToken]
        public Documento ExportarNacimientosExcel(string filtro)
        {
            try
            {
                var filtroDesearizado = JsonConvert.DeserializeObject<NacimientoFilter>(filtro);
                return CM.NacimientosExportarExcel(filtroDesearizado);
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

        [Route("api/Campo/BorrarCampo")]
        [HttpPut]
        [AutorizationToken]
        public void DeleteCampo(long codigoCampo)
        {
            try
            {
                CM.Delete(codigoCampo);
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