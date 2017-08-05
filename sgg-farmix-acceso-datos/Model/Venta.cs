using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace sgg_farmix_acceso_datos.Model
{
    public class Venta
    {
        public long idVenta { get; set; }
        public string fecha { get; set; }
        public float monto { get; set; }
        public long idEstablecimientoDestino { get; set; }
        public long idBovino { get; set; }
    }
}
