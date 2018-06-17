using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace sgg_farmix_acceso_datos.Model
{
    public class Nacimiento
    {
        public long? idNacimiento { get; set; }
        public string fechaNacimiento { get; set; }
        public long idBovinoMadre { get; set; }
        public long? idBovinoPadre { get; set; }
        public long codigoCampo { get; set; }
    }
}
