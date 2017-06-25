using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace sgg_farmix_acceso_datos.Model
{
    public class Resultados
    {
        public IEnumerable<Estado> estados { get; set; }
        public IEnumerable<Raza> razas { get; set; }
        public IEnumerable<Categoria> categorias { get; set; }
        public IEnumerable<Rodeo> rodeos { get; set; }
        public IEnumerable<EstablecimientoOrigen> establecimientos { get; set; }
    }
}
