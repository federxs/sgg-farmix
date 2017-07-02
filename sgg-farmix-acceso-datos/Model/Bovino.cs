using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace sgg_farmix_acceso_datos.Model
{
    public class Bovino
    {
        public long idBovino { get; set; }
        public int numCaravana { get; set; }
        public string apodo { get; set; }
        public string descripcion { get; set; }
        public string fechaNacimiento { get; set; }
        public int genero { get; set; }
        public float peso { get; set; }
        public float pesoAlNacer { get; set; }
        public string fechaMuerte { get; set; }
        public long idBovinoMadre { get; set; }
        public long idBovinoPadre { get; set; }
        public long idCategoria { get; set; }
        public long idRaza { get; set; }
        public long idRodeo { get; set; }
        public long idEstablecimientoOrigen { get; set; }
        public long idEstado { get; set; }
    }

    public class BovinoFilter
    {
        public long idCategoria { get; set; }
        public int genero { get; set; }
        public long idRaza { get; set; }
        public long idRodeo { get; set; }
        public long idEstado { get; set; }
        public float peso { get; set; }
        public string accionPeso { get; set; }

    }
}
