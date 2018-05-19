﻿using Newtonsoft.Json;
using sgg_farmix_acceso_datos.DAOs;
using sgg_farmix_acceso_datos.Model;
using sgg_farmix_helper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace sgg_farmix_api.Controllers
{    
    public class InconsistenciaController : ApiController
    {
        private InconsistenciaManager IM = new InconsistenciaManager();

        [Route("api/Inconsistencia/GetList")]
        [HttpGet]
        [AutorizationToken]
        public IEnumerable<Inconsistencia> GetList(string filtro)
        {
            try
            {
                var filtroDesearizado = JsonConvert.DeserializeObject<InconsistenciaFilter>(filtro);
                return IM.GetList(filtroDesearizado);
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(new HttpResponseMessage(HttpStatusCode.NotFound)
                {
                    Content = new StringContent(string.Format("Error: {0}", ex.Message)),
                    ReasonPhrase = (ex.GetType() == typeof(ArgumentException) ? ex.Message : "Get_Error")
                });
            }
        }

        [Route("api/Inconsistencia/Get")]
        [HttpGet]
        [AutorizationToken]
        public InconsistenciaResolver Get(long idEvento, long idEventoConflictivo, long idInseminacion, long idInseminacionConflictiva)
        {
            try
            {
                return IM.Get(idEvento, idEventoConflictivo, idInseminacion, idInseminacionConflictiva);
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(new HttpResponseMessage(HttpStatusCode.NotFound)
                {
                    Content = new StringContent(string.Format("Error: {0}", ex.Message)),
                    ReasonPhrase = (ex.GetType() == typeof(ArgumentException) ? ex.Message : "Get_Error")
                });
            }
        }
    }
}