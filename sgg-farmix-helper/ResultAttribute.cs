using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace sgg_farmix_helper
{
    public class ResultAttribute : Attribute
    {

        [DefaultValue(10)]
        public int MaxLength { get; set; }
        [DefaultValue("2000/01/01")]
        public string MaxDate { get; set; }
        [DefaultValue("2015/12/31")]
        public string MinDate { get; set; }
        [DefaultValue(System.Int64.MinValue)]
        public long MinValue { get; set; }

        [DefaultValue(System.Int64.MaxValue)]
        public long MaxValue { get; set; }
        [DefaultValue(null)]
        public string[] Values { get; set; }
    }
}
