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
        public UsuarioLogueado GetUser(string usuario, string codigoCampo, long idRol, string periodo)
        {
            try
            {
                var campo = Regex.Replace(codigoCampo, @"[^\d]", "");
                UsuarioLogueado usuarioLogueado;
                //x ahora lo dejo asi, es una chanchada, pero bueno! para la tesis safa jaja
                if (idRol != 4)
                    usuarioLogueado = UM.GetDatosUserLogueado(usuario, Int64.Parse(campo), idRol, periodo);
                else
                {
                    usuarioLogueado = new UsuarioLogueado()
                    {
                        apellido = "Administración",
                        cantidadInconsistencias = 0,
                        cantidadNacimientos = 0,
                        idUsuario = 63,
                        rol = "Administración"
                    };
                }
                usuarioLogueado.menus = MM.GetMenus(idRol);
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