using sgg_farmix_acceso_datos.Helper;
using sgg_farmix_acceso_datos.Model;
using sgg_farmix_helper;
using System;
using System.Collections.Generic;
using System.Data.Common;
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
            connection = new SqlServerConnection();
            DbTransaction transaction = connection.BeginTransaction();
            try
            {                
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
                    { "@borrado", 0 },
                    { "@usuario", entity.usuario },
                    { "@codigoCampo", entity.codigoCampo }
                };
                if (entity.pesoAlNacer != 0)
                    parametros.Add("@pesoAlNacer", entity.pesoAlNacer);
                if (entity.idBovinoMadre != 0)
                    parametros.Add("@idBovinoMadre", entity.idBovinoMadre);
                if (entity.idBovinoPadre != 0)
                    parametros.Add("@idBovinoPadre", entity.idBovinoPadre);
                if (entity.idEstablecimientoOrigen != 0)
                    parametros.Add("@idEstabOrigen", entity.idEstablecimientoOrigen);

                entity.idBovino = connection.Execute("spRegistrarBovino", parametros, System.Data.CommandType.StoredProcedure, transaction);
                if (entity.idBovino == 0)
                    throw new ArgumentException("Create Bovino Error"); 
                else if (entity.idBovino == 1)
                    throw new ArgumentException("Bovino ya existe");
                var parametrosEvento = new Dictionary<string, object>
                {
                    {"@cant", entity.cantAlimento },
                    {"@idTipoEvento", 4 }
                };
                var idEvento = connection.Execute("spRegistrarEvento", parametrosEvento, System.Data.CommandType.StoredProcedure, transaction);
                if(idEvento == 0)
                    throw new ArgumentException("Create Evento Error");
                parametrosEvento = new Dictionary<string, object>
                {
                    {"@idBovino", entity.idBovino },
                    {"@idEvento", idEvento }
                };
                var insert = connection.Execute("spRegistrarEventosXBovino", parametrosEvento, System.Data.CommandType.StoredProcedure, transaction);
                if (insert == 0)
                    throw new ArgumentException("Create EventosXBovino Error");
                //parametros = null;
                parametrosEvento = new Dictionary<string, object>
                {
                    {"@codigoCampo", 1 },
                    {"@idRodeoDestino", entity.idRodeo },
                    {"@idTipoEvento", 3 }
                };
                idEvento = connection.Execute("spRegistrarEvento", parametrosEvento, System.Data.CommandType.StoredProcedure, transaction);
                parametrosEvento = new Dictionary<string, object>
                {
                    {"@idBovino", entity.idBovino },
                    {"@idEvento", idEvento }
                };
                insert = connection.Execute("spRegistrarEventosXBovino", parametrosEvento, System.Data.CommandType.StoredProcedure, transaction);
                if (insert == 0)
                    throw new ArgumentException("Create EventosXBovino Error");
                if (idEvento == 0)
                    throw new ArgumentException("Create Evento Error");
                connection.Commit(transaction);               
                return entity;
            }
            catch (Exception ex)
            {
                connection.Rollback(transaction);
                throw;
            }
            finally
            {
                connection.Close();
                connection = null;
                transaction = null;
            }
        }

        public string ValidarCaravana(long numCaravana, long codigoCampo)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@numCaravana", numCaravana },
                    {"@codigoCampo", codigoCampo }
                };
                var resultado = connection.Execute("spValidarCaravana", parametros, System.Data.CommandType.StoredProcedure);
                if (resultado == 1) //existe ese numero de caravana ya en el sistema para ese campo
                    return "1";
                else
                    return "0";
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

        public IEnumerable<Bovino> Get(Bovino entity)
        {
            throw new NotImplementedException();
        }

        public Bovino Get(long id, long codigoCampo)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@idBovino", id },
                    {"@codigoCampo", codigoCampo }
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
                connection = null;
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
                connection = null;
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
                    {"@accionPeso", (filter.accionPeso == "0" ? null : filter.accionPeso) },
                    {"@idCampo", filter.codigoCampo }
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
                connection = null;
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
                connection = null;
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
                connection = null;
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
                connection = null;
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
                connection = null;
            }
        }

        public IEnumerable<TagBovino> GetTags(long codigoCampo)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>{
                    { "@codigoCampo", codigoCampo}
                };
                var listaTags = connection.GetArray<TagBovino>("spGetTagsBovinos", parametros, System.Data.CommandType.StoredProcedure);
                return listaTags;
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
                connection = null;
            }
        }

        public Bovino Get(long id)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<Provincia> GetProvincias()
        {
            try
            {
                connection = new SqlServerConnection();
                var lista = connection.GetArray<Provincia>("spObtenerListaProvincias", null, System.Data.CommandType.StoredProcedure);
                return lista.ToList();
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

        public IEnumerable<Localidad> GetLocalidades()
        {
            try
            {
                connection = new SqlServerConnection();
                var lista = connection.GetArray<Localidad>("spObtenerListaLocalidades", null, System.Data.CommandType.StoredProcedure);
                return lista.ToList();
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

        public ResultadoValidacionCampo ValidarCantidadBovinos(string usuario)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@usuario", usuario }
                };
                var resultado = connection.GetArray<ResultadoValidacionCampo>("spValidarCantidadBovinosXAdmin", parametros, System.Data.CommandType.StoredProcedure);
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
