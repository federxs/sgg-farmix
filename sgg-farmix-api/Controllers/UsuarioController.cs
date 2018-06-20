using sgg_farmix_acceso_datos.DAOs;
using sgg_farmix_acceso_datos.Model;
using sgg_farmix_helper;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Text.RegularExpressions;
using System.Web.Http;
using Newtonsoft.Json;
using System.Threading.Tasks;
using System.Web;
using System.Diagnostics;
using System.Linq;

namespace sgg_farmix_api.Controllers
{
    public class UsuarioController : ApiController
    {
        private UsuarioManager UM = new UsuarioManager();
        [Route("api/Usuario/Validar")]
        [HttpPost]
        public ResultadoValidacion ValidarUsuario(string usuario)
        {
            try
            {
                var user = JsonConvert.DeserializeObject<Usuario>(usuario);
                return UM.ValidarUsuario(user);
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

        [Route("api/Usuario/GetList")]
        [HttpGet]
        [AutorizationToken]
        public IEnumerable<Usuario> GetList(string filter)
        {
            try
            {
                var filtro = JsonConvert.DeserializeObject<UsuarioFilter>(filter);
                return UM.GetList(filtro);
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

        [Route("api/Usuario/Init")]
        [HttpGet]
        [AutorizationToken]
        public Resultados Get()
        {
            Resultados resultado = new Resultados();
            try
            {
                resultado.roles = new RolManager().GetRoles();
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

        [HttpPost]
        [AutorizationToken]
        public async Task<Usuario> Post()
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
                    if (result.FormData["usuario"] == null)
                    {
                        throw new HttpResponseException(HttpStatusCode.BadRequest);
                    }
                    var usuarioObject = JsonConvert.DeserializeObject<Usuario>(result.FormData["usuario"]);

                    var usuarioNuevo = UM.Create(usuarioObject, usuarioObject.codigoCampo);

                    foreach (MultipartFileData file in provider.FileData)
                    {
                        var multimediaObject = new Multimedia
                        {
                            mulTipo = file.Headers.ContentType.MediaType.StartsWith("image", StringComparison.InvariantCulture) ? 1 : 2,
                            mulPath = $"{file.LocalFileName.Split('\\').Last()}.{ file.Headers.ContentType.MediaType.Split('/').Last()}",
                            idUsuario = usuarioNuevo.idUsuario
                        };
                        var newFileName = $"{usuarioNuevo.idUsuario}_ImagenUsuario.{file.Headers.ContentType.MediaType.Split('/').Last()}";
                        MoveFiles.MoveFilesUsuarioToFolder(file.LocalFileName, newFileName);

                        multimediaObject.mulPath = newFileName;

                        new MultimediaManager().Create(multimediaObject);

                        Trace.WriteLine(file.Headers.ContentDisposition.FileName);
                        Trace.WriteLine("Server file path: " + file.LocalFileName);
                    }

                    return usuarioNuevo;
                }
                catch (Exception ex)
                {
                    throw;
                }

                //var user = JsonConvert.DeserializeObject<Usuario>(usuario);
                //var codCampo = Regex.Replace(codigoCampo, @"[^\d]", "");
                //return UM.Create(user, Int64.Parse(codCampo));
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
        public Usuario Get(string idUsuario)
        {
            try
            {
                var id = Regex.Replace(idUsuario, @"[^\d]", "");
                return UM.Get(Int64.Parse(id));
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

        [Route("api/Usuario/GetDetalle")]
        [HttpGet]
        [AutorizationToken]
        public UsuarioDetalle GetDetalle(string idUsuario)
        {
            try
            {
                var id = Regex.Replace(idUsuario, @"[^\d]", "");
                return UM.GetDetalle(Int64.Parse(id));
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
        public Usuario Put(string usuario)
        {
            try
            {
                var user = JsonConvert.DeserializeObject<Usuario>(usuario);
                return UM.Update(user.idUsuario, user);
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

        [Route("api/Usuario/DarBaja")]
        [HttpPut]
        [AutorizationToken]
        public void BajaUsuario(string idUsuario, long codigoCampo)
        {
            try
            {
                var id = Regex.Replace(idUsuario, @"[^\d]", "");
                UM.Delete(Int64.Parse(id), codigoCampo);
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

        [Route("api/Usuario/Activar")]
        [HttpPut]
        [AutorizationToken]
        public void ActivarUsuario(string idUsuario, long codigoCampo)
        {
            try
            {
                var id = Regex.Replace(idUsuario, @"[^\d]", "");
                UM.Activar(Int64.Parse(id), codigoCampo);
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

        [Route("api/Usuario/GetDatosPerfil")]
        [HttpGet]
        [AutorizationToken]
        public UsuarioLogueado GetPerfil(long campo, string usuario, long idRol)
        {
            try
            {
                return UM.GetDatosUserLogueado(usuario, campo, idRol);
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

        [Route("api/Usuario/ValidarCantUsuarios")]
        [HttpGet]
        [AutorizationToken]
        public ResultadoValidacionCampo ValidarCantCamposUsuario(long campo)
        {
            try
            {
                return UM.ValidarCantidadUsuarios(campo);
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

        [Route("api/Usuario/UpdatePerfil")]
        [HttpPut]
        [AutorizationToken]
        public async Task<UsuarioLogueado> ActualizarPerfil()
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
                    if (result.FormData["usuario"] == null)
                    {
                        throw new HttpResponseException(HttpStatusCode.BadRequest);
                    }
                    var usuarioObject = JsonConvert.DeserializeObject<UsuarioLogueado>(result.FormData["usuario"]);

                    var usuarioNuevo = UM.UpdatePerfil(usuarioObject);

                    if (usuarioNuevo.idUsuario > 0)
                    {
                        foreach (MultipartFileData file in provider.FileData)
                        {
                            var multimediaObject = new Multimedia
                            {
                                mulTipo = file.Headers.ContentType.MediaType.StartsWith("image", StringComparison.InvariantCulture) ? 1 : 2,
                                mulPath = $"{file.LocalFileName.Split('\\').Last()}.{ file.Headers.ContentType.MediaType.Split('/').Last()}",
                                idUsuario = usuarioNuevo.idUsuario
                            };
                            var newFileName = $"{usuarioNuevo.idUsuario}_ImagenUsuario.{file.Headers.ContentType.MediaType.Split('/').Last()}";
                            MoveFiles.DeleteFilesUsuarioToFolder(file.LocalFileName, newFileName);
                            MoveFiles.MoveFilesUsuarioToFolder(file.LocalFileName, newFileName);

                            multimediaObject.mulPath = newFileName;

                            new MultimediaManager().Update(0, multimediaObject);

                            Trace.WriteLine(file.Headers.ContentDisposition.FileName);
                            Trace.WriteLine("Server file path: " + file.LocalFileName);
                        }
                    }

                    return usuarioNuevo;
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
    }
}