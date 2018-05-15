using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace sgg_farmix_acceso_datos.Model
{
    public class Vacuna
    {
        public long idVacuna { get; set; }
        public string nombre { get; set; }
        public float cantidad { get; set; }
        public long codigoCampo { get; set; }
    }
}
