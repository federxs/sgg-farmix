using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace sgg_farmix_acceso_datos.Model
{
    public class Inconsistencia
    {
        public long? idTacto { get; set; }
        public string fechaTacto { get; set; }
        public long? idTactoConflictivo { get; set; }
        public string fechaTactoConflictivo { get; set; }
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
        public string periodo { get; set; }
    }

    public class InconsistenciaResolver
    {
        public Tacto tactoAnterior { get; set; }
        public Tacto tactoNuevo { get; set; }
        public Tacto tactoResultante { get; set; }
        public InseminacionDetalle inseminacionAnterior { get; set; }
        public InseminacionDetalle inseminacionNueva { get; set; }
        public InseminacionDetalle inseminacionResultante { get; set; }
    }
}
