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
    public class TactoManager : IManager<Tacto>
    {
        private SqlServerConnection connection;
        public Tacto Create(Tacto entity)
        {
            throw new NotImplementedException();
        }

        public void Delete(long id)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<Tacto> Get(Tacto entity)
        {
            throw new NotImplementedException();
        }

        public Tacto Get(long id)
        {
            throw new NotImplementedException();
        }

        public Tacto GetFilter()
        {
            throw new NotImplementedException();
        }

        public Tacto Update(long id, Tacto entity)
        {
            throw new NotImplementedException();
        }

        public Tacto Insert(Tacto tacto)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@idTipoTacto", tacto.idTipoTacto },
                    {"@exitoso", tacto.exitoso },
                    {"@idInseminacion", tacto.idInseminacion },
                    {"@fechaTacto", tacto.fechaTacto },
                    {"@codigoCampo", tacto.codigoCampo }
                };
                var insert = connection.Execute("spRegistrarTactoXInseminacion", parametros, System.Data.CommandType.StoredProcedure);
                return tacto;
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
