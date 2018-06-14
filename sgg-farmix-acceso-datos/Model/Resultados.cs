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
        public IEnumerable<Rol> roles { get; set; }
        public IEnumerable<Antibiotico> antibioticos { get; set; }
        public IEnumerable<Provincia> provincias { get; set; }
        public IEnumerable<Localidad> localidades { get; set; }
    } 

    public class ResultadoValidacion
    {
        public long resultado { get; set; }
        public long codigoCampo { get; set; }
        public string token { get; set; }
        public int inconsistencias { get; set; }
        public int idRol { get; set; }
    }
}
