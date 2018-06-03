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
    public class CampoManager : IManager<Campo>
    {
        private SqlServerConnection connection;
        public Campo Create(Campo entity)
        {
            try
            {
                connection = new SqlServerConnection();

                var parametros = new Dictionary<string, object>()
                {
                    {"@nombre", entity.nombre },
                    {"@superficie", entity.superficie },
                    {"@idLocalidad", entity.idLocalidad },
                    {"@usuario", entity.usuario }
                };

                if (entity.latitud != 0)
                    parametros.Add("@latitud", entity.latitud);
                if (entity.longitud != 0)
                    parametros.Add("@longitud", entity.longitud);

                entity.idCampo = connection.Execute("spRegistrarCampo", parametros, System.Data.CommandType.StoredProcedure);
                if (entity.idCampo == 0)
                    throw new ArgumentException("CreateCampoError");
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

        public IEnumerable<Campo> GetList(string usuario, long idRol)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@usuario", usuario },
                    {"@idRol", idRol }
                };
                var campos = connection.GetArray<Campo>("spGetCampos", parametros, System.Data.CommandType.StoredProcedure);
                return campos;
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

        public ResultadoValidacionCampo ValidarCantidadCampos(string usuario)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@usuario", usuario }
                };
                var resultado = connection.GetArray<ResultadoValidacionCampo>("spValidarCantidadCamposXUsuario", parametros, System.Data.CommandType.StoredProcedure);
                return resultado.First();
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

        public ResultadoValidacion GetInconsistencias(long codigoCampo)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@codigoCampo", codigoCampo }
                };
                var resultado = connection.GetArray<ResultadoValidacion>("spObtenerInconsistenciasPorCampo", parametros, System.Data.CommandType.StoredProcedure);
                return resultado.First();
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
