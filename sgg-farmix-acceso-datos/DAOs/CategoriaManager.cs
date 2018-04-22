using sgg_farmix_acceso_datos.Helper;
using sgg_farmix_acceso_datos.Model;
using sgg_farmix_helper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace sgg_farmix_acceso_datos.DAOs
{
    public class CategoriaManager : IManager<Categoria>
    {
        private SqlServerConnection connection;
        public Categoria Create(Categoria entity)
        {
            connection = new SqlServerConnection();
            try
            {
                var parametros = new Dictionary<string, object>
                {
                    {"@nombre", entity.nombre },
                    {"@genero", entity.genero }
                };

                entity.idCategoria = connection.Execute("spRegistrarCategoria", parametros, System.Data.CommandType.StoredProcedure);
                if (entity.idCategoria == 0)
                    throw new ArgumentException("Create Categoria Error");
                else if (entity.idCategoria == -1)
                    throw new ArgumentException("Categoria ya existe");
                return entity;
            }
            catch (Exception ex)
            {
                throw;
            }
            finally
            {
                connection.Close();
                connection = null;
            }
        }

        public IEnumerable<Categoria> GetList()
        {
            try
            {
                connection = new SqlServerConnection();
                var lista = connection.GetArray<Categoria>("spGetCategorias", null, System.Data.CommandType.StoredProcedure);
                return lista;
            }
            catch (Exception ex)
            {
                throw;
            }
            finally
            {
                connection.Close();
                connection = null;
            }
        }

        public void Delete(long id)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<Categoria> Get(Categoria entity)
        {
            throw new NotImplementedException();
        }

        public Categoria Get(long id)
        {
            throw new NotImplementedException();
        }

        public Categoria GetFilter()
        {
            throw new NotImplementedException();
        }

        public Categoria Update(long id, Categoria entity)
        {
            throw new NotImplementedException();
        }
    }
}
