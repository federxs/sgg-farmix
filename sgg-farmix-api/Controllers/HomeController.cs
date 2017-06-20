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
    public class HomeController : ApiController
    {
        private MenuManager MM = new MenuManager();
        [HttpGet]
        public IEnumerable<Menu> GetMenus()
        {            
            try
            {
                return MM.GetMenus();
            }
            catch (Exception ex)
            {
                //if (ex.GetType() != typeof(ArgumentException)) Elmah.ErrorSignal.FromCurrentContext().Raise(ex);
                throw new HttpResponseException(new HttpResponseMessage(HttpStatusCode.NotFound)
                {
                    Content = new StringContent(string.Format("Error: {0}", ex.Message)),
                    ReasonPhrase = (ex.GetType() == typeof(ArgumentException) ? ex.Message : "Get_Error")
                });
            }
        }
    }
}