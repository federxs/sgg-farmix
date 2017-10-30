using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace sgg_farmix_acceso_datos.Model
{
    public class DashBoard
    {
        public long bovinos { get; set; }
        public long eventos { get; set; }
        public long ventas { get; set; }
        public long vacasPreniadas { get; set; }
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
