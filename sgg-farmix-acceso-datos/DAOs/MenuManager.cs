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
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                    {
                        {"@Usu_Id", null }
                    };
                var lista = connection.GetArray<Menu>("spGetMenues", parametros, System.Data.CommandType.StoredProcedure);

                List <Menu> list = lista.ToList();

                for (int i = 0; i < list.Count(); i++)
                {
                    if(list.ElementAt(i).idMenuPadre != 0)
                    {
                        for (int j = 0; j < list.Count(); j++)
                        {
                            if(list.ElementAt(j).idMenu == list.ElementAt(i).idMenuPadre)
                            {
                                list.ElementAt(j).menu_Hijos = new List<Menu>();
                                list.ElementAt(j).menu_Hijos.Add(lista.ElementAt(i));
                                list.RemoveAt(i);
                                break;
                            }
                        }
                    }
                }

                return list.ToList();
            }
            catch (Exception ex)
            {
                throw;
            }
            finally
            {
                connection.Close();
            }

        }
    }
}
