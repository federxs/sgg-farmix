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
    public class DashboardController : ApiController
    {
        private DashboarManager DM = new DashboarManager();

        [Route("api/Dashboard/Get")]
        [HttpGet]
        [AutorizationToken]
        public DashBoard Get(string id)
        {
            try
            {
                var idCampo = Regex.Replace(id, @"[^\d]", "");
                return DM.Get(Int64.Parse(idCampo));
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