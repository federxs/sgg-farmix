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
        public bool borrado { get; set; }
        public long idAlimento { get; set; }
        public float cantAlimento { get; set; }
        public string fechaEstimadaParto { get; set; }
        public string usuario { get; set; }
        public long? codigoCampo { get; set; }
        public string diasFaltantesXDarALuz { get; set; }
        public int enfermo { get; set; }
        public long? idNacimiento { get; set; }
    }

    public class BovinoFilter
    {
        public long idCategoria { get; set; }
        public int genero { get; set; }
        public long idRaza { get; set; }
        public long idRodeo { get; set; }
        public long idEstado { get; set; }
        public float peso { get; set; }
        public long numCaravana { get; set; }
        public string accionPeso { get; set; }
        public long codigoCampo { get; set; }
        public string periodo { get; set; }

    }

    public class BovinoItem
    {
        public long idBovino { get; set; }
        public long numCaravana { get; set; }
        public string categoriaNombre { get; set; }
        public string sexo { get; set; }
        public string razaNombre { get; set; }
        public string rodeoNombre { get; set; }
        public string estadoNombre { get; set; }
        public float peso { get; set; }
    }

    public class BovinoDetalle
    {
        public long numCaravana { get; set; }
        public long idBovinoMadre { get; set; }
        public long idBovinoPadre { get; set; }
        public string establecimientoOrigen { get; set; }
        public string rodeo { get; set; }
        public string apodo { get; set; }
        public string estado { get; set; }
        public int sexo { get; set; }
        public string fechaNacimiento { get; set; }
        public float peso { get; set; }
        public float pesoAlNacer { get; set; }
        public string categoria { get; set; }
        public string raza { get; set; }
        public string descripcion { get; set; }
        public int enfermo { get; set; }
    }

    public class BovinoHeaderEliminar
    {
        public long idBovino { get; set; }
        public long numCaravana { get; set; }
        public long idBovinoMadre { get; set; }
        public long idBovinoPadre { get; set; }
        public string establecimientoOrigen { get; set; }
        public string rodeo { get; set; }
        public Resultados establecimientosDestino { get; set; }
    }

    //A esta clase la van a usar los chicos en la App para llenar la BD local
    public class TagBovino
    {
        public long idBovino { get; set; }
        public long numCaravana { get; set; }
        public bool escrito { get; set; }
        public string apodo { get; set; }
        public string descripcion { get; set; }
        public string fechaNacimiento { get; set; }
        public int genero { get; set; }
        public float peso { get; set; }
        public float pesoAlNacer { get; set; }
        public long idCategoria { get; set; }
        public long idRaza { get; set; }
        public long idRodeo { get; set; }
        public long idEstado { get; set; }
        public string fechaEstimadaParto { get; set; }
        public int enfermo { get; set; }
    }

    public class NacimientoFilter
    {
        public long numCaravanaMadre { get; set; }
        public long numCaravanaPadre { get; set; }
        public string fechaDesde { get; set; }
        public string fechaHasta { get; set; }
        public long codigoCampo { get; set; }
        public string periodo { get; set; }
    }
    public class NacimientoItem
    {
        public long idNacimiento { get; set; }
        public string numCaravanaMadre { get; set; }
        public string numCaravanaPadre { get; set; }
        public string fechaNacimiento { get; set; }
    }
}
