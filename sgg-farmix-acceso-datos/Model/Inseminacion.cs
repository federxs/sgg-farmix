using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace sgg_farmix_acceso_datos.Model
{
    public class Inseminacion
    {
        public long idVaca { get; set; }
        public string fechaInseminacion { get; set; }
        public bool tacto { get; set; }
        public string fechaEstimadaNacimiento { get; set; }
        public long tipoInseminacion { get; set; }
        public long idToro { get; set; }
    }
    public class InseminacionInit
    {
        public long hembrasParaServicio { get; set; }
        public long serviciosSinConfirmar { get; set; }
        public long preniadasPorParir { get; set; }
        public long lactanciasActivas { get; set; }
    }
    public class ServSinConfirmar
    {
        public string fechaInseminacion { get; set; }
        public IEnumerable<BovinoItem> bovinos { get; set; }
    }

    public class PreniadasXParir
    {
        public string fechaParicion { get; set; }
        public IEnumerable<BovinoItem> bovinos { get; set; }
    }
}
