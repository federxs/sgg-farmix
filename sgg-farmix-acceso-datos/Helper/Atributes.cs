using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace sgg_farmix_acceso_datos.Helper
{
    public class ParamAttribute : Attribute
    {
        [DefaultValue("")]
        public string paramName { get; set; }
        public Type convertTo { get; set; }
    }

    public class EntityAttribute : Attribute
    {
        public string spListName { get; set; }
        public string spGetName { get; set; }
        public string spSaveName { get; set; }
        public string idGetParamName { get; set; }
    }
}
