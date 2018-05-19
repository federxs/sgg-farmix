using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace sgg_farmix_acceso_datos.Model
{
    public class Inconsistencia
    {
        public long? idEvento { get; set; }
        public long? idEventoConflictivo { get; set; }
        public long? idInseminacion { get; set; }
        public long? idInseminacionConflictiva { get; set; }
        public string tipo { get; set; }
        public string fecha { get; set; }
        public string estado { get; set; }
    }

    public class InconsistenciaFilter
    {
        public long codigoCampo { get; set; }
        public int tipo { get; set; }
        public int estado { get; set; }
        public string fechaDesde { get; set; }
        public string fechaHasta { get; set; }
    }

    public class InconsistenciaResolver
    {
        public EventoDetalle eventoAnterior { get; set; }
        public EventoDetalle eventoNuevo { get; set; }
        public Inseminacion inseminacionAnterior { get; set; }
        public Inseminacion inseminacionResultante { get; set; }
    }
}
