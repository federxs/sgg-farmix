using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace sgg_farmix_acceso_datos.Model
{
    public class Reportes
    {
    }
    public class ReporteBovinos
    {
        public long nroOrden { get; set; }
        public long numCaravana { get; set; }
        public string sexo { get; set; }
        public string raza { get; set; }
        public string categoria { get; set; }
        public string edad { get; set; }
        public float peso { get; set; }
        public string estado { get; set; }
        public string rodeo { get; set; }
        public string enfermo { get; set; }
        public string meses { get; set; }
        public string anos { get; set; }
    }

    public class ReporteFilter
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
        public string campo { get; set; }
        public string usuario { get; set; }
        public string accionNroPartos { get; set; }
        public int nroPartos { get; set; }
        public string fechaDesde { get; set; }
        public string fechaHasta { get; set; }
        public int idTipoEvento { get; set; }
        public string fechaInseminacion { get; set; }
        public string fechaParto { get; set; }
        public int idTipoInseminacion { get; set; }
    }

    public class ReporteBovinosFilterDatos
    {
        public string categoria { get; set; }
        public string raza { get; set; }
        public string rodeo { get; set; }
        public string estado { get; set; }
    }

    public class ReporteInseminacionHembrasServir
    {
        public long nroOrden { get; set; }
        public long numCaravana { get; set; }
        public string raza { get; set; }
        public string categoria { get; set; }
        public float peso { get; set; }
        public string estado { get; set; }
        public string meses { get; set; }
        public string anos { get; set; }
        public long partos { get; set; }
    }

    public class ReporteInseminacionServiciosSinConfirmar
    {
        public long nroOrden { get; set; }
        public long numCaravana { get; set; }
        public string raza { get; set; }
        public string categoria { get; set; }
        public float peso { get; set; }
        public string estado { get; set; }
        public string meses { get; set; }
        public string anos { get; set; }
        public string tipoInseminacion { get; set; }
        public string fechaInseminacion { get; set; }
    }

    public class ReporteInseminacionLactanciasActivas
    {
        public long nroOrden { get; set; }
        public long numCaravana { get; set; }
        public string raza { get; set; }
        public string categoria { get; set; }
        public float peso { get; set; }
        public string meses { get; set; }
        public string anos { get; set; }
        public long partos { get; set; }
        public string alimento { get; set; }
        public string fechaUltimoParto { get; set; }
    }

    public class ReporteInseminacionPreniadas
    {
        public long nroOrden { get; set; }
        public long numCaravana { get; set; }
        public string raza { get; set; }
        public string categoria { get; set; }
        public float peso { get; set; }
        public string meses { get; set; }
        public string anos { get; set; }
        public string tipoInseminacion { get; set; }
        public string fechaParto { get; set; }
    }

    public class ReporteEventos
    {
        public long nroOrden { get; set; }
        public long idEvento { get; set; }
        public string tipoEvento { get; set; }
        public string fechaHora { get; set; }
        public long duracion { get; set; }
        public string descripcion { get; set; }
        public string caravanas { get; set; }
    }

    public class Caravana
    {
        public long caravana { get; set; }
    }
}
