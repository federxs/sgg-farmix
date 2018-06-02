using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace sgg_farmix_acceso_datos.Model
{
    public class Reportes
    {
    }
    public class ReporteBovinos
    {
        public long nroOrden { get; set; }
        public long numCaravana { get; set; }
        public string sexo { get; set; }
        public string raza { get; set; }
        public string categoria { get; set; }
        public string edad { get; set; }
        public float peso { get; set; }
        public string estado { get; set; }
        public string rodeo { get; set; }
        public string enfermo { get; set; }
        public string meses { get; set; }
        public string anos { get; set; }
    }
}
