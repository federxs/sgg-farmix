using Newtonsoft.Json;
using sgg_farmix_acceso_datos.DAOs;
using sgg_farmix_acceso_datos.Model;
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
    public class TactoController : ApiController
    {
        private TactoManager TM = new TactoManager();

        [Route("api/Tacto/Insert")]
        [HttpPost]
        public Tacto InsertTactoXInseminacion(string tacto)
        {
            try
            {
                var objTacto = JsonConvert.DeserializeObject<Tacto>(tacto);
                return TM.Insert(objTacto);
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