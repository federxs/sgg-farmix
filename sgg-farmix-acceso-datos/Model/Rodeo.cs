using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace sgg_farmix_acceso_datos.Model
{
    public class Rodeo
    {
        public long idRodeo { get; set; }
        public bool confinado { get; set; }
        public string nombre { get; set; }
        public long idCampo { get; set; }
    }
}
