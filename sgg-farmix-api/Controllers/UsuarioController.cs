using Newtonsoft.Json;
using sgg_farmix_acceso_datos.DAOs;
using sgg_farmix_acceso_datos.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace sgg_farmix_api.Controllers
{
    public class UsuarioController : ApiController
    {
        private UsuarioManager UM = new UsuarioManager();
        [Route("api/Usuario/Validar")]
        [HttpPost]
        public ResultadoValidacion ValidarUsuario(string usuario)
        {
            try
            {
                var user = JsonConvert.DeserializeObject<Usuario>(usuario);
                return UM.ValidarUsuario(user);
            }
            catch (Exception ex)
            {

                throw;
            }
        }
    }
}