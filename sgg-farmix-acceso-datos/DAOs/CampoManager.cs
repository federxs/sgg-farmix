using sgg_farmix_acceso_datos.Helper;
using sgg_farmix_acceso_datos.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace sgg_farmix_acceso_datos.DAOs
{
    public class CampoManager : IManager<Campo>
    {
        private SqlServerConnection connection;
        public Campo Create(Campo entity)
        {
            throw new NotImplementedException();
        }

        public void Delete(long id)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<Campo> Get(Campo entity)
        {
            throw new NotImplementedException();
        }

        public Campo Get(long id)
        {
            throw new NotImplementedException();
        }

        public Campo GetFilter()
        {
            throw new NotImplementedException();
        }

        public Campo Update(long id, Campo entity)
        {
            throw new NotImplementedException();
        }
    }
}
