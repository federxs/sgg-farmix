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
    public class AlimentoController : ApiController
    {
        private AlimentoManager AM = new AlimentoManager();

        [Route("api/Alimento/GetList")]
        [HttpGet]
        public IEnumerable<Alimento> GetList(string idCampo)
        {
            try
            {
                var id = Regex.Replace(idCampo, @"[^\d]", "");
                return AM.GetList(Int64.Parse(id));
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
        public Alimento Post([FromBody]Alimento alimento)
        {
            try
            {
                return AM.Create(alimento);
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
    }
}