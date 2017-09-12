using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace sgg_farmix_acceso_datos.Model
{
    public class DashBoard
    {
        public int bovinos { get; set; }
        public int eventos { get; set; }
        public int ventas { get; set; }
        public IEnumerable<DatosGraficoRaza> graficoRaza { get; set; }
        public IEnumerable<DatosGraficoCategorias> graficoCategorias { get; set; }
    }

    public class DatosGraficoRaza
    {
        public string raza { get; set; }
        public int cantidadBovinos { get; set; }
    }

    public class DatosGraficoCategorias
    {
        public string categoria { get; set; }
        public int cantidad { get; set; }
    }
}
