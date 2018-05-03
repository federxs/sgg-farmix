using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace sgg_farmix_acceso_datos.Model
{
    public class Campo
    {
        public long idCampo { get; set; }
        public string nombre { get; set; }
        public float latitud { get; set; }
        public float longitud { get; set; }
        public float superficie { get; set; }
        public string unidad { get; set; }
        public long idLocalidad { get; set; }
        public long codigoCampo { get; set; }
        public string usuario { get; set; }
        public Multimedia multimedia { get; set; }
    }

    public class ResultadoValidacionCampo
    {
        public bool resultado { get; set; }
    }
}
