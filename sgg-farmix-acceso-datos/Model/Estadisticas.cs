using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace sgg_farmix_acceso_datos.Model
{
    public class Estadisticas
    {

    }
    public class EstadisticasBovino
    {
        public List<EstadisticaBajaPorMes> bajasXMes { get; set; }
        public List<EstadisticaBovinosXRodeo> bovinosXRodeo { get; set; }
        public List<EstadisticaNacimientosXMes> nacimientos { get; set; }
        public List<EstadisticaPesoPromXRaza> pesosPromXRaza { get; set; }
        public List<EstadisticaTop10Alimentos> top10Alimentos { get; set; }
        public EstadisticaBovinoInicio inicio { get; set; }
    }

    public class EstadisticaBajaPorMes
    {
        public int mes { get; set; }
        public long? cantidadMuertes { get; set; }
        public long? cantidadVentas { get; set; }
    }

    public class EstadisticaBovinosXRodeo
    {
        public string rodeo { get; set; }
        public long cantidad { get; set; }
    }

    public class EstadisticaNacimientosXMes
    {
        public long mes { get; set; }
        public long cantidadNacimientos { get; set; }
    }

    public class EstadisticaPesoPromXRaza
    {
        public string nombre { get; set; }
        public float pesoPromedioHembra { get; set; }
        public float pesoPromedioMacho { get; set; }
    }

    public class EstadisticaTop10Alimentos
    {
        public string alimento { get; set; }
        public long cantidad { get; set; }
    }

    public class EstadisticaBovinoInicio
    {
        public long toroMasPesado { get; set; }
        public long vacaMasPesada { get; set; }
        public long BovinoMasJoven { get; set; }
        public long BovinoMasNuevo { get; set; }
        public long toroMasLiviano { get; set; }
        public long vacaMasLiviana { get; set; }
        public long BovinoMasViejo { get; set; }
        public long BovinoMasViejoSist { get; set; }
    }
}
