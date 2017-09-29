using sgg_farmix_acceso_datos.Helper;
using sgg_farmix_acceso_datos.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace sgg_farmix_acceso_datos.DAOs
{
    public class BovinoManager : IManager<Bovino>
    {
        private SqlServerConnection connection;
        public Bovino Create(Bovino entity)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@numCaravana", entity.numCaravana },
                    {"@apodo", (entity.apodo == null ? null : entity.apodo) },
                    {"@descripcion", (entity.descripcion == null ? null : entity.descripcion) },
                    {"@fechaNac", entity.fechaNacimiento },
                    {"@genero", entity.genero },
                    {"@peso", entity.peso },
                    { "@idCategoria", entity.idCategoria },
                    { "@idRaza", entity.idRaza },
                    { "@idRodeo", entity.idRodeo },
                    { "@idEstado", entity.idEstado },
                    { "@borrado", 0 }
            };
                if (entity.pesoAlNacer != 0)
                    parametros.Add("@pesoAlNacer", entity.pesoAlNacer);
                if (entity.idBovinoMadre != 0)
                    parametros.Add("@idBovinoMadre", entity.idBovinoMadre);
                if (entity.idBovinoPadre != 0)
                    parametros.Add("@idBovinoPadre", entity.idBovinoPadre);
                if (entity.idEstablecimientoOrigen != 0)
                    parametros.Add("@idEstabOrigen", entity.idEstablecimientoOrigen);

                entity.idBovino = connection.Execute("spRegistrarBovino", parametros, System.Data.CommandType.StoredProcedure);
                if (entity.idBovino == 0)
                    throw new ArgumentException("Create Bovino Error");
                else if (entity.idBovino == 1)
                    throw new ArgumentException("Bovino ya existe");
                return entity;
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

        public string ValidarCaravana(long numCaravana)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@numCaravana", numCaravana }
                };
                var resultado = connection.Execute("spValidarCaravana", parametros, System.Data.CommandType.StoredProcedure);
                if (resultado == 1) //existe ese numero de caravana ya en el sistema
                    return "1";
                else
                    return "0";
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public void Delete(long id)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<Bovino> Get(Bovino entity)
        {
            throw new NotImplementedException();
        }

        public Bovino Get(long id)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@idBovino", id }
                };
                var bovino = connection.GetArray<Bovino>("spObtenerDatosBovino", parametros, System.Data.CommandType.StoredProcedure).FirstOrDefault();
                return bovino;
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

        public Bovino GetFilter()
        {
            throw new NotImplementedException();
        }

        public Bovino Update(long id, Bovino entity)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@idBovino", id },
                    {"@numCaravana", entity.numCaravana },
                    {"@apodo", entity.apodo },
                    {"@desc", entity.descripcion },
                    {"@fechaNac", entity.fechaNacimiento },
                    {"@genero", entity.genero },
                    {"@peso", entity.peso },
                    //{"@fechaMuerte", entity.fechaMuerte },
                    {"@idCatego", entity.idCategoria },
                    {"@idRaza", entity.idRaza },
                    {"@idRodeo", entity.idRodeo },
                    {"@idEstado", entity.idEstado }
                };
                if (entity.pesoAlNacer != 0)
                    parametros.Add("@pesoAlNacer", entity.pesoAlNacer);
                if (entity.idBovinoMadre != 0)
                    parametros.Add("@idBovinoMadre", entity.idBovinoMadre);
                if (entity.idBovinoPadre != 0)
                    parametros.Add("@idBovinoPadre", entity.idBovinoPadre);
                if (entity.idEstablecimientoOrigen != 0)
                    parametros.Add("@idEstabOrigen", entity.idEstablecimientoOrigen);

                var update = connection.Execute("spModificarBovino", parametros, System.Data.CommandType.StoredProcedure);
                if (update == 0)
                {
                    throw new ArgumentException("Update bovino error");
                }
                return entity;
            }
            catch (Exception ex)
            {
                return null;
            }
            finally
            {
                connection.Close();
            }
        }

        public int Borrar(long id)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<BovinoItem> GetList(BovinoFilter filter)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@idCatego", filter.idCategoria },
                    {"@genero", filter.genero },
                    {"@idRaza", filter.idRaza },
                    {"@idRodeo", filter.idRodeo },
                    {"@idEstado", filter.idEstado },
                    {"@peso", filter.peso },
                    {"@accionPeso", (filter.accionPeso == "0" ? null : filter.accionPeso) }
                };
                if (filter.numCaravana != 0)
                    parametros.Add("@numCaravana", filter.numCaravana.ToString());
                var lista = connection.GetArray<BovinoItem>("spObtenerListaBovinos", parametros, System.Data.CommandType.StoredProcedure);
                return lista.ToList();
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

        public BovinoDetalle GetDetalle(long id)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@idBovino", id }
                };
                var bovino = connection.GetArray<BovinoDetalle>("spObtenerDetalleBovino", parametros, System.Data.CommandType.StoredProcedure).FirstOrDefault();
                return bovino;
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

        public BovinoHeaderEliminar GetDetalleBaja(long id)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@idBovino", id }
                };
                var bovino = connection.GetArray<BovinoHeaderEliminar>("spObtenerHeaderBaja", parametros, System.Data.CommandType.StoredProcedure).FirstOrDefault();
                return bovino;
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

        public void DeleteMuerte(long id, string fechaMuerte)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@idBovino", id },
                    {"@fechaMuerte", fechaMuerte }
                };
                var update = connection.Execute("spBajaBovinoMuerte", parametros, System.Data.CommandType.StoredProcedure);
                if (update == 0)
                    throw new ArgumentException("Baja de bovino por muerte error");
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

        public void DeleteVenta(Venta entity)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@idBovino", entity.idBovino},
                    {"@idEstabDestino", entity.idEstablecimientoDestino},
                    {"@monto", entity.monto}
                };
                entity.idVenta = connection.Execute("spRegistrarVenta", parametros, System.Data.CommandType.StoredProcedure);
                if (entity.idVenta == 0)
                    throw new ArgumentException("Create Bovino Error");
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

        public IEnumerable<TagBovino> GetTags()
        {
            try
            {
                connection = new SqlServerConnection();
                var listaTags = connection.GetArray<TagBovino>("spGetTagsBovinos", null, System.Data.CommandType.StoredProcedure);
                return listaTags;
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

        public bool EscribirTag(long idBovino)
        {
            try
            {
                bool ban = true;
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@idBovino", idBovino }
                };
                var si = connection.Execute("spActualizarEscritoTag", parametros, System.Data.CommandType.StoredProcedure);
                if (si == 0)
                {
                    ban = false;
                    throw new ArgumentException("Update Error");
                }
                else if (si == -1)
                {
                    ban = false;
                    throw new ArgumentException("Bovino no existe");
                }
                return ban;
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
