using sgg_farmix_acceso_datos.Helper;
using sgg_farmix_acceso_datos.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace sgg_farmix_acceso_datos.DAOs
{
    public class MenuManager : IManager<Menu>
    {
        SqlServerConnection connection;
        public Menu Create(Menu entity)
        {
            throw new NotImplementedException();
        }

        public void Delete(long id)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<Menu> Get(Menu entity)
        {
            throw new NotImplementedException();
        }

        public Menu Get(long id)
        {
            throw new NotImplementedException();
        }

        public Menu GetFilter()
        {
            throw new NotImplementedException();
        }

        public Menu Update(long id, Menu entity)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<Menu> GetMenus()
        {
            connection = new SqlServerConnection();
            var parametros = new Dictionary<string, object>
            {
                {"@Usu_Id", null }
            };
            var lista = connection.GetArray<Menu>("spGetMenues", parametros, System.Data.CommandType.StoredProcedure);
            return lista.ToList();
        }
    }
}
