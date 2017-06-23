using sgg_farmix_acceso_datos.DAOs;
using sgg_farmix_acceso_datos.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace sgg_farmix_api.Controllers
{
    public class BovinoController : ApiController
    {
        /*private BovinoManager BM = new BovinoManager();

        [HttpGet]
        public Bovino Get(long id)
        {
            try
            {
                return BM.Get(id);
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
        */
    }
}