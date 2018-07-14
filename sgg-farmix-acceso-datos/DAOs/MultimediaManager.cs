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
    public class MultimediaManager : IManager<Multimedia>
    {
        private SqlServerConnection connection;
        public Multimedia Create(Multimedia entity)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@mulTipo", entity.mulTipo },
                    {"@mulPath", entity.mulPath }
                };
                if (entity.idCampo != 0)
                    parametros.Add("@idCampo", entity.idCampo);
                if (entity.idUsuario != 0)
                    parametros.Add("@idUsuario", entity.idUsuario);

                entity.mulId = connection.Execute("spRegistrarMultimedia", parametros, System.Data.CommandType.StoredProcedure);
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

        public void Delete(long id)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<Multimedia> Get(Multimedia entity)
        {
            throw new NotImplementedException();
        }

        public Multimedia Get(long id)
        {
            throw new NotImplementedException();
        }

        public Multimedia GetFilter()
        {
            throw new NotImplementedException();
        }

        public Multimedia Update(long id, Multimedia entity)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>()
                {
                    {"@idUsuario", entity.idUsuario },
                    {"@mulPath", entity.mulPath }
                };
                entity.mulId = connection.Execute("spActualizarMultimedia", parametros, System.Data.CommandType.StoredProcedure);
                if (entity.mulId == 0)
                    Create(entity);
                    //throw new ArgumentException("Update Perfil Error");
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
    }
}
