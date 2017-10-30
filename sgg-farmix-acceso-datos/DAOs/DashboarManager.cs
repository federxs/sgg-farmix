using sgg_farmix_acceso_datos.Helper;
using sgg_farmix_acceso_datos.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace sgg_farmix_acceso_datos.DAOs
{
    public class DashboarManager : IManager<DashBoard>
    {
        private SqlServerConnection connection;
        public DashBoard Create(DashBoard entity)
        {
            throw new NotImplementedException();
        }

        public void Delete(long id)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<DashBoard> Get(DashBoard entity)
        {
            throw new NotImplementedException();
        }

        public DashBoard Get(long id)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@codigoCampo", id }
                };
                var dashboard = connection.GetArray<DashBoard>("spGetDashBoard", parametros, System.Data.CommandType.StoredProcedure).FirstOrDefault();
                dashboard.graficoRaza = connection.GetArray<DatosGraficoRaza>("spGetCantBovinosXRaza", parametros, System.Data.CommandType.StoredProcedure);
                dashboard.graficoCategorias = connection.GetArray<DatosGraficoCategorias>("spGetCantBovinosXCategoria", parametros, System.Data.CommandType.StoredProcedure);
                return dashboard;
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

        public DashBoard GetFilter()
        {
            throw new NotImplementedException();
        }

        public DashBoard Update(long id, DashBoard entity)
        {
            throw new NotImplementedException();
        }
    }
}
