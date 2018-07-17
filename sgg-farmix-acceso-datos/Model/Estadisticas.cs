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
        public List<EstadisticaTop10BovinosLivianos> top10BovinosMasLivianos { get; set; }
        public List<EstadisticaUltimosBovinosBaja> ultimosBovinosBajas { get; set; }
        public EstadisticaBovinoInicio inicio { get; set; }
    }

    public class EstadisticaBajaPorMes
    {
        public string mes { get; set; }
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
        public string mes { get; set; }
        public long cantidadNacimientos { get; set; }
    }

    public class EstadisticaPesoPromXRaza
    {
        public string nombre { get; set; }
        public float pesoPromedioHembra { get; set; }
        public float pesoPromedioMacho { get; set; }
    }

    public class EstadisticaTop10BovinosLivianos
    {
        public string numCaravana { get; set; }
        public float peso { get; set; }
    }

    public class EstadisticaUltimosBovinosBaja
    {
        public string numCaravana { get; set; }
        public string fechaBaja { get; set; }
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
        public EstadisticaInseminacionInicio inicio { get; set; }
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
        public string numCaravana { get; set; }
        public long? cantidad { get; set; }
    }
    public class EstadisticaHijosPorBovino
    {
        public string numCaravana { get; set; }
        public long? cantidadHijos { get; set; }
    }
    public class EstadisticaAbortosPorVaca
    {
        public string numCaravana { get; set; }
        public long? cantidadAbortos { get; set; }
    }

    public class EstadisticaInseminacionInicio
    {
        public Cuadro4EstadisticaInseminacion cuadro4 { get; set; }
        public Cuadro2EstadisticaInseminacion cuadro2 { get; set; }
        public Cuadro3EstadisticaInseminacion cuadro3 { get; set; }
        public Cuadro1EstadisticaInseminacion cuadro1 { get; set; }
        public Cuadro5EstadisticaInseminacion cuadro5 { get; set; }
        public Cuadro6EstadisticaInseminacion cuadro6 { get; set; }
    }
    public class Cuadro1EstadisticaInseminacion
    {
        public long caravanaVacaConMasHijos { get; set; }
        public long idVacaConMasHijos { get; set; }
    }
    public class Cuadro2EstadisticaInseminacion
    {
        public long caravanaVacaMasDificilEmbarazar { get; set; }
        public long idVacaMasDificilEmbarazar { get; set; }
    }
    public class Cuadro3EstadisticaInseminacion
    {
        public long caravanaVacaConMasAbortos { get; set; }
        public long idVacaConMasAbortos { get; set; }
    }
    public class Cuadro4EstadisticaInseminacion
    {
        public long caravanaToroConMasHijos { get; set; }
        public long idToroConMasHijos { get; set; }
    }
    public class Cuadro5EstadisticaInseminacion
    {
        public long caravanaToroMasSemental { get; set; }
        public long idToroMasSemental { get; set; }
    }    
    public class Cuadro6EstadisticaInseminacion
    {
        public long caravanaUltimaVacaInseminada { get; set; }
        public long idUltimaVacaInseminada { get; set; }
    }

    public class EstadisticasEvento
    {
        public List<EstadisticaAntibioticoMasUsado> antibioticosMasUsados { get; set; }
        public List<EstadisticaCambiosPorBovino> cambiosAlimentacionXBovino { get; set; }
        public List<EstadisticaCambiosPorBovino> movimientosXBovino { get; set; }
        public List<EstadisticaEventoPorTipoPorMes> eventosXTipoXMes { get; set; }
        public List<EstadisticaEventoPorTipoPorGenero> eventosXTipoXGenero { get; set; }
        public List<EstadisticaVacunaMenosUsada> vacunasMenosUsadas { get; set; }
        public List<EstadisticaTop10Alimentos> top10Alimentos { get; set; }
        public EstadisticaEventoInicio inicio { get; set; }
    }

    public class EstadisticaAntibioticoMasUsado
    {
        public string antibiotico { get; set; }
        public long? cantidad { get; set; }
    }

    public class EstadisticaCambiosPorBovino
    {
        public string numCaravana { get; set; }
        public long? cantidad { get; set; }
    }

    public class EstadisticaEventoPorTipoPorMes
    {
        public string mes { get; set; }
        public long? cantidadAlimenticio { get; set; }
        public long? cantidadAntibiotico { get; set; }
        public long? cantidadManejo { get; set; }
        public long? cantidadVacunacion { get; set; }
    }
    public class EstadisticaEventoPorTipoPorGenero
    {
        public string tipoEvento { get; set; }
        public long? cantidadHembra { get; set; }
        public long? cantidadMacho { get; set; }
    }
    public class EstadisticaVacunaMenosUsada
    {
        public string vacuna { get; set; }
        public long? cantidad { get; set; }
    }

    public class EstadisticaTop10Alimentos
    {
        public string alimento { get; set; }
        public long cantidad { get; set; }
    }

    public class EstadisticaEventoInicio
    {
        public long caravanaBovinoMasCambiosRodeo { get; set; }
        public long idBovinoMasCambiosRodeo { get; set; }
        public long caravanaBovinoMasCambiosAlimenticios { get; set; }
        public long idBovinoMasCambiosAlimenticios { get; set; }
        public long caravanaBovinoMasEnfermo { get; set; }
        public long idBovinoMasEnfermo { get; set; }
        public long caravanaBovinoQueMasComio { get; set; }
        public long idBovinoQueMasComio { get; set; }
        public long caravanaUltimoBovinoVacunado { get; set; }
        public long idUltimoBovinoVacunado { get; set; }
        public long caravanaUltimoBovinoConAntibiotico { get; set; }
        public long idUltimoBovinoConAntibiotico { get; set; }
    }
}