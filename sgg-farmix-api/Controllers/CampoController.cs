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
    public class CampoController : ApiController
    {
        private CampoManager CM = new CampoManager();
        [HttpPost]
        public Campo Post([FromBody] Campo campo)
        {
            try
            {
                return CM.Create(campo);
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
        public IEnumerable<Campo> GetList(string usuario)
        {
            try
            {
                return CM.GetList(usuario);
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
    }
}