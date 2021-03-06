﻿using sgg_farmix_acceso_datos.DAOs;
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
    public class TipoEventoController : ApiController
    {
        private TipoEventoManager TEM = new TipoEventoManager();
        [Route("api/TipoEvento/GetList")]
        [HttpGet]
        [AutorizationToken]
        public IEnumerable<TipoEvento> GetList()
        {
            try
            {
                return TEM.GetList();
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