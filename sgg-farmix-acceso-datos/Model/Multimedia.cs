using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace sgg_farmix_acceso_datos.Model
{
    public class Multimedia
    {
        public long mulId { get; set; }
        public int mulTipo { get; set; }
        public string mulPath { get; set; }
        public long idCampo { get; set; }
        public long idUsuario { get; set; }
    }
}
