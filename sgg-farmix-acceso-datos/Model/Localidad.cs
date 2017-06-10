using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace sgg_farmix_acceso_datos.Model
{
    public class Localidad
    {
        public long idLocalidad { get; set; }
        public string nombre { get; set; }
        public long idProvincia { get; set; }
    }
}
