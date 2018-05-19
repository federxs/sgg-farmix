﻿using sgg_farmix_acceso_datos.Helper;
using sgg_farmix_acceso_datos.Model;
using sgg_farmix_helper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace sgg_farmix_acceso_datos.DAOs
{
    public class InconsistenciaManager : IManager<Inconsistencia>
    {
        private SqlServerConnection connection;
        public Inconsistencia Create(Inconsistencia entity)
        {
            throw new NotImplementedException();
        }

        public void Delete(long id)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<Inconsistencia> Get(Inconsistencia entity)
        {
            throw new NotImplementedException();
        }

        public Inconsistencia Get(long id)
        {
            throw new NotImplementedException();
        }

        public Inconsistencia GetFilter()
        {
            throw new NotImplementedException();
        }

        public Inconsistencia Update(long id, Inconsistencia entity)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<Inconsistencia> GetList(InconsistenciaFilter filter)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>
                {
                    {"@tipo", filter.tipo },
                    {"@estado", filter.estado },
                    {"@fechaDesde", filter.fechaDesde },
                    {"@fechaHasta", filter.fechaHasta },
                    {"@codigoCampo", filter.codigoCampo }
                };
                var lista = connection.GetArray<Inconsistencia>("spObtenerListaInconsistencias", parametros, System.Data.CommandType.StoredProcedure);
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

        public InconsistenciaResolver Get(long idEvento, long idEveConflic, long idInsem, long idInsemConflic)
        {
            try
            {
                connection = new SqlServerConnection();
                var parametros = new Dictionary<string, object>();
                var obj = new InconsistenciaResolver();
                if(idEvento != 0 && idEveConflic != 0)
                {
                    parametros.Add("@idEvento", idEvento);
                    obj.eventoAnterior = connection.GetArray<EventoDetalle>("spGetEvento", parametros, System.Data.CommandType.StoredProcedure).FirstOrDefault();
                    parametros = new Dictionary<string, object>();
                    parametros.Add("@idEvento", idEveConflic);
                    obj.eventoNuevo = connection.GetArray<EventoDetalle>("spObtenerDatosEventoConflictivo", parametros, System.Data.CommandType.StoredProcedure).FirstOrDefault();
                }
                else if(idInsem != 0 && idInsemConflic != 0)
                {

                }
                //var lista = connection.GetArray<Inconsistencia>("spObtenerListaInconsistencias", parametros, System.Data.CommandType.StoredProcedure);
                return obj;
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
