using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace sgg_farmix_acceso_datos.Model
{
    public class Usuario
    {
        public long idUsuario { get; set; }
        public string usuario { get; set; }
        public string nombre { get; set; }
        public string apellido { get; set; }
        public string pass { get; set; }
        public string fechaAlta { get; set; }
        public string fechaBaja { get; set; }
        public long idRol { get; set; }
        public long idPlan { get; set; }
        public string rol { get; set; }
        public long codigoCampo { get; set; }
        public string contrasenia { get; set; }
    }

    public class UsuarioFilter
    {
        public string nombre { get; set; }
        public string apellido { get; set; }
        public long idRol { get; set; }
        public long codigoCampo { get; set; }
        public long rolLogueado { get; set; }
        public string campo { get; set; }
        public string usuario { get; set; }
    }

    public class UsuarioDetalle
    {
        public long idUsuario { get; set; }
        public string usuario { get; set; }
        public string nombre { get; set; }
        public string apellido { get; set; }
        public string pass { get; set; }
        public string fechaAlta { get; set; }
        public string fechaBaja { get; set; }
        public string rol { get; set; }
    }

    public class UsuarioLogueado
    {
        public long idUsuario { get; set; }
        public string nombre { get; set; }
        public string apellido { get; set; }
        public string rol { get; set; }
        public string campo { get; set; }
        public IEnumerable<Menu> menus { get; set; }
        public string usuarioImagen { get; set; }
        public string usuario { get; set; }
        public long cantidadInconsistencias { get; set; }
        public long cantidadNacimientos { get; set; }
    }

    public class Cliente
    {
        public long idAdministrador { get; set; }
        public string nombre { get; set; }
        public string apellido { get; set; }
        public string fechaAlta { get; set; }
        public long idPlan { get; set; }
        public string nombrePlan { get; set; }
        public long cantidadAdministradores { get; set; }
        public long cantidadUsuarios { get; set; }
        public long cantidadCampos { get; set; }
        public long cantidadBovinos { get; set; }
        public string estadoCuenta { get; set; }
    }

    public class Plan
    {
        public long idPlan { get; set; }
        public string nombre { get; set; }
    }
}
