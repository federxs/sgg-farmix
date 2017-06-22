using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace sgg_farmix_acceso_datos.Model
{
    public class Menu
    {
        public long idMenu { get; set; }
        public string nombre { get; set; }
        public string urlMenu { get; set; }
        public long idEstado { get; set; }
        public int idMenuPadre { get; set; }
        public string menIcono { get; set; }
        public string menNombreApp { get; set; }
    }
}
