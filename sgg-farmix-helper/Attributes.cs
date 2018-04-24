using System;
using System.ComponentModel;

namespace sgg_farmix_helper
{
    public class ParamAttribute : Attribute
    {
        [DefaultValue("")]
        public string ParamName { get; set; }
        public Type ConvertTo { get; set; }

    }
    public class EntityAttribute : Attribute
    {
        public string SpListName { get; set; }
        public string SpGetName { get; set; }
        public string SpSaveName { get; set; }
        public string IdGetParamName { get; set; }

    }


}
