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
    public class RazaController  : ApiController
    {
        private RazaManager RM = new RazaManager();
        [HttpPost]
        [AutorizationToken]
        public Raza Post([FromBody]Raza categoria)
        {
            try
            {
                return RM.Create(categoria);
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(new HttpResponseMessage(HttpStatusCode.NotFound)
                {
                    Content = new StringContent(string.Format("Error: {0}", ex.Message)),
                    ReasonPhrase = (ex.GetType() == typeof(ArgumentException) ? ex.Message : "Create_Error")
                });
            }
        }

        [HttpGet]
        [AutorizationToken]
        public IEnumerable<Raza> Get(long codigoCampo)
        {
            try
            {
                return RM.GetList(codigoCampo);
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