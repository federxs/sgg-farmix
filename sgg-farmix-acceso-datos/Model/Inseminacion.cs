using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace sgg_farmix_acceso_datos.Model
{
    public class Inseminacion
    {
        public long idInseminacion { get; set; }
        public long idVaca { get; set; }
        public string fechaInseminacion { get; set; }
        public string fechaEstimadaNacimiento { get; set; }
        public long tipoInseminacion { get; set; }
        public long codigoCampo { get; set; }
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
        public string tipoInseminacion { get; set; }
        public long cantidadVacas { get; set; }
        public long cantidadToros { get; set; }
        public long idInseminacion { get; set; }
        public long idVaca { get; set; }
    }
    public class PreniadasXParir
    {
        public long idInseminacion { get; set; }
        public string fechaInseminacion { get; set; }
        public string tipoInseminacion { get; set; }
        public long cantidadVacas { get; set; }
        public string fechaEstimadaParto { get; set; }
    }
    public class InseminacionDetalle
    {
        public long idInseminacion { get; set; }
        public string fechaInseminacion { get; set; }
        public string fechaEstimadaNacimiento { get; set; }
        public string tipoInseminacion { get; set; }
        public int idTipoInseminacion { get; set; }
        public long numCaravanaBovino { get; set; }
        public IEnumerable<BovinoItem> listaBovinos { get; set; }
        public IEnumerable<Tacto> tactos { get; set; }
        public IEnumerable<BovinoItem> listaToros { get; set; }
    }
}
