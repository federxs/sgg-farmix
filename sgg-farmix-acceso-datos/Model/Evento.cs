using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace sgg_farmix_acceso_datos.Model
{
    public class Evento
    {
        public long idEvento { get; set; }
        public string fechaHora { get; set; }
        public long idTipoEvento { get; set; }
        public long idVacuna { get; set; }
        public float cantidad { get; set; }
        public long idCampoOrigen { get; set; }
        public long idCampoActual { get; set; }
        public long idAntibiotico { get; set; }
        public long idAlimento { get; set; }
    }

    public class EventosXBovino
    {
        public long idBovino { get; set; }
        public long idEvento { get; set; }
    }

    public class EventoFilter
    {
        public long numCaravana { get; set; }
        public long idTipoEvento { get; set; }
        public string fechaDesde { get; set; }
        public string fechaHasta { get; set; }
    }
}
