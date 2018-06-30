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
        public long caravanaToroMasPesado { get; set; }
        public long idToroMasPesado { get; set; }
        public long caravanaVacaMasPesada { get; set; }
        public long idVacaMasPesada { get; set; }
        public long caravanaBovinoMasJoven { get; set; }
        public long idBovinoMasJoven { get; set; }
        public long caravanaBovinoMasNuevo { get; set; }
        public long idBovinoMasNuevo { get; set; }
        public long caravanaToroMasLiviano { get; set; }
        public long idToroMasLiviano { get; set; }
        public long caravanaVacaMasLiviana { get; set; }
        public long idVacaMasLiviana { get; set; }
        public long caravanaBovinoMasViejo { get; set; }
        public long idBovinoMasViejo { get; set; }
        public long caravanaBovinoMasViejoSist { get; set; }
        public long idBovinoMasViejoSist { get; set; }
    }

    public class EstadisticasInseminacion
    {
        public List<EstadisticaInseminacionPorCategoria> inseminacionXCategoriaHembra { get; set; }
        public List<EstadisticaInseminacionPorCategoria> inseminacionXCategoriaMacho { get; set; }
        public List<EstadisticaInseminacionPorRaza> inseminacionXRaza { get; set; }
        public List<EstadisticaInseminacionPorTipo> inseminacionXTipo { get; set; }
        public List<EstadisticaInseminacionPorBovino> inseminacionExitosaXToro { get; set; }
        public List<EstadisticaInseminacionPorBovino> inseminacionFallidaXVaca { get; set; }
        public List<EstadisticaHijosPorBovino> hijosXToro { get; set; }
        public List<EstadisticaHijosPorBovino> hijosXVaca { get; set; }
        public List<EstadisticaAbortosPorVaca> abortosXVaca { get; set; }
    }

    public class EstadisticaInseminacionPorCategoria
    {
        public string categoria { get; set; }
        public long? cantidadExitosa { get; set; }
        public long? cantidadFallida { get; set; }
    }

    public class EstadisticaInseminacionPorRaza
    {
        public string raza { get; set; }
        public long? cantidadExitosa { get; set; }
        public long? cantidadFallida { get; set; }
    }
    public class EstadisticaInseminacionPorTipo
    {
        public string tipo { get; set; }
        public long? cantidadExitosa { get; set; }
        public long? cantidadFallida { get; set; }
    }
    public class EstadisticaInseminacionPorBovino
    {
        public long numCaravana { get; set; }
        public long? cantidad { get; set; }
    }
    public class EstadisticaHijosPorBovino
    {
        public long numCaravana { get; set; }
        public long? cantidadHijos { get; set; }
    }
    public class EstadisticaAbortosPorVaca
    {
        public long numCaravana { get; set; }
        public long? cantidadAbortos { get; set; }
    }
}
