using sgg_farmix_acceso_datos.DAOs;
using sgg_farmix_acceso_datos.Model;
using sgg_farmix_helper;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Text.RegularExpressions;
using System.Web.Http;

namespace sgg_farmix_api.Controllers
{
    public class HomeController : ApiController
    {
        private MenuManager MM = new MenuManager();
        private UsuarioManager UM = new UsuarioManager(); 

        [Route("api/Home/GetDatosUserLogueado")]
        [HttpGet]
        [AutorizationToken]
        public UsuarioLogueado GetUser(string usuario, string codigoCampo, long idRol)
        {
            try
            {
                var campo = Regex.Replace(codigoCampo, @"[^\d]", "");
                var usuarioLogueado = UM.GetDatosUserLogueado(usuario, Int64.Parse(campo), idRol);
                usuarioLogueado.menus = MM.GetMenus();
                return usuarioLogueado;
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