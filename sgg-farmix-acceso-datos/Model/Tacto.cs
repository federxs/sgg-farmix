using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace sgg_farmix_acceso_datos.Model
{
    public class Tacto
    {
        public long idInseminacion { get; set; }
        public string fechaTacto { get; set; }
        public string exitoso { get; set; }
        public string tipoTacto { get; set; }
        public long idTipoTacto { get; set; }
        public long numCaravanaBovino { get; set; }
    }
}
