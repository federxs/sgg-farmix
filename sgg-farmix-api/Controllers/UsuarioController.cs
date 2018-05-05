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
        public Usuario Post(string usuario, string codigoCampo)
        {
            try
            {
                var user = JsonConvert.DeserializeObject<Usuario>(usuario);
                var codCampo = Regex.Replace(codigoCampo, @"[^\d]", "");
                return UM.Create(user, Int64.Parse(codCampo));
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
        public void BajaUsuario(string idUsuario)
        {
            try
            {
                var id = Regex.Replace(idUsuario, @"[^\d]", "");
                UM.Delete(Int64.Parse(id));
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
        public void ActivarUsuario(string idUsuario)
        {
            try
            {
                var id = Regex.Replace(idUsuario, @"[^\d]", "");
                UM.Activar(Int64.Parse(id));
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