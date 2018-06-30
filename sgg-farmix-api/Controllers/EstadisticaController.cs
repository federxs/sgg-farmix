using sgg_farmix_acceso_datos.DAOs;
using sgg_farmix_acceso_datos.Model;
using sgg_farmix_helper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace sgg_farmix_api.Controllers
{
    public class EstadisticaController : ApiController
    {
        private EstadisticaManager EM = new EstadisticaManager();
        [Route("api/Estadistica/Bovino")]
        [HttpGet]
        [AutorizationToken]
        public EstadisticasBovino GetEstadisticasBovino(long codigoCampo, string periodo)
        {
            try
            {
                return EM.GetEstadisticaBovino(codigoCampo, periodo);
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

        [Route("api/Estadistica/Inseminacion")]
        [HttpGet]
        [AutorizationToken]
        public EstadisticasInseminacion GetEstadisticasInseminacion(long codigoCampo, string periodo)
        {
            try
            {
                return EM.GetEstadisticaInseminacion(codigoCampo, periodo);
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