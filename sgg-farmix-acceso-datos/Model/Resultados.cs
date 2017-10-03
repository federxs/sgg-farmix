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
        public Bovino bovino { get; set; }
        public IEnumerable<Vacuna> vacunas { get; set; }
        public IEnumerable<TipoEvento> tipoEvento { get; set; }
        public EventoDetalle listaBovinos { get; set; }
        public IEnumerable<Campo> campos { get; set; }
        public IEnumerable<Alimento> alimentos { get; set; }
    }
}
