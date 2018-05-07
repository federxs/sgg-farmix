using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace sgg_farmix_acceso_datos.Model
{
    public class Estado
    {
        public long idEstado { get; set; }
        public string nombre { get; set; }
        public string descripcion { get; set; }
        public int genero { get; set; }
        public long codigoCampo { get; set; }
    }
}
