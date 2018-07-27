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
    public class ReportesController : ApiController
    {
        [Route("api/Reportes/BovinosFiltro")]
        [HttpGet]
        [AutorizationToken]
        public IEnumerable<ReporteBovinos> GetReporteBovinosFiltro(string filtro)
        {
            try
            {
                var filtroDeserealizado = JsonConvert.DeserializeObject<ReporteFilter>(filtro);
                return new BovinoManager().GetReporteFiltros(filtroDeserealizado);
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

        [Route("api/Reportes/BovinosExportarPDF")]
        [HttpGet]
        [AutorizationToken]
        public Documento ExportarReporteBovinosPDF(string filtro)
        {
            try
            {
                var filtroDesearizado = JsonConvert.DeserializeObject<ReporteFilter>(filtro);
                return new BovinoManager().ReporteBovinosExportarPDF(filtroDesearizado);
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

        [Route("api/Reportes/BovinosExportarExcel")]
        [HttpGet]
        [AutorizationToken]
        public Documento ExportarReporteBovinosExcel(string filtro)
        {
            try
            {
                var filtroDesearizado = JsonConvert.DeserializeObject<ReporteFilter>(filtro);
                return new BovinoManager().ReporteBovinosExportarExcel(filtroDesearizado);
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

        [Route("api/Reportes/Inseminacion/HembrasServir")]
        [HttpGet]
        [AutorizationToken]
        public IEnumerable<ReporteInseminacionHembrasServir> GetReporteHembrasServir(string filtro)
        {
            try
            {
                var filtroDesearizado = JsonConvert.DeserializeObject<ReporteFilter>(filtro);
                return new InseminacionManager().GetReporteHembrasServir(filtroDesearizado);
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

        [Route("api/Reportes/InseminacionHembrasParaServirExportarPDF")]
        [HttpGet]
        [AutorizationToken]
        public Documento ExportarReporteInseminacionesHembrasServirPDF(string filtro)
        {
            try
            {
                var filtroDesearizado = JsonConvert.DeserializeObject<ReporteFilter>(filtro);
                return new InseminacionManager().ReporteInseminacionHembrasServicioExportarPDF(filtroDesearizado);
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

        [Route("api/Reportes/InseminacionHembrasParaServirExportarExcel")]
        [HttpGet]
        [AutorizationToken]
        public Documento ExportarReporteInseminacionesHembrasServirExcel(string filtro)
        {
            try
            {
                var filtroDesearizado = JsonConvert.DeserializeObject<ReporteFilter>(filtro);
                return new InseminacionManager().ReporteInseminacionHembrasServicioExportarExcel(filtroDesearizado);
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

        [Route("api/Reportes/Inseminacion/ServiciosSinConfirmar")]
        [HttpGet]
        [AutorizationToken]
        public IEnumerable<ReporteInseminacionServiciosSinConfirmar> GetReporteServiciosSinConfirmar(long codigoCampo, string periodo)
        {
            try
            {
                return new InseminacionManager().GetReporteServiciosSinConfirmar(codigoCampo, periodo);
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

        [Route("api/Reportes/InseminacionServiciosSinConfirmarExportarPDF")]
        [HttpGet]
        [AutorizationToken]
        public Documento ExportarReporteInseminacionesServiciosSinConfirmarPDF(string campo, long codigoCampo, string periodo, string usuario)
        {
            try
            {
                return new InseminacionManager().ReporteInseminacionServiciosSinConfirmarExportarPDF(campo, codigoCampo, periodo, usuario);
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

        [Route("api/Reportes/InseminacionServiciosSinConfirmarExportarExcel")]
        [HttpGet]
        [AutorizationToken]
        public Documento ExportarReporteInseminacionesServiciosSinConfirmarExcel(string campo, long codigoCampo, string periodo, string usuario)
        {
            try
            {
                return new InseminacionManager().ReporteInseminacionServiciosSinConfirmarExportarExcel(campo, codigoCampo, periodo, usuario);
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

        [Route("api/Reportes/Inseminacion/LactanciasActivas")]
        [HttpGet]
        [AutorizationToken]
        public IEnumerable<ReporteInseminacionLactanciasActivas> GetReporteLactanciasActivas(long codigoCampo, string periodo)
        {
            try
            {
                return new InseminacionManager().GetReporteLactanciasActivas(codigoCampo, periodo);
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

        [Route("api/Reportes/InseminacionLactanciasExportarPDF")]
        [HttpGet]
        [AutorizationToken]
        public Documento ExportarReporteInseminacionesLactanciasPDF(string campo, long codigoCampo, string periodo, string usuario)
        {
            try
            {
                return new InseminacionManager().ReporteInseminacionLactanciasExportarPDF(campo, codigoCampo, periodo, usuario);
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

        [Route("api/Reportes/InseminacionLactanciasExportarExcel")]
        [HttpGet]
        [AutorizationToken]
        public Documento ExportarReporteInseminacionesLactanciasExcel(string campo, long codigoCampo, string periodo, string usuario)
        {
            try
            {
                return new InseminacionManager().ReporteInseminacionLactanciasExportarExcel(campo, codigoCampo, periodo, usuario);
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

        [Route("api/Reportes/Inseminacion/Preniadas")]
        [HttpGet]
        [AutorizationToken]
        public IEnumerable<ReporteInseminacionPreniadas> GetReportePreniadas(long codigoCampo, string periodo)
        {
            try
            {
                return new InseminacionManager().GetReportePreniadas(codigoCampo, periodo);
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

        [Route("api/Reportes/InseminacionPreniadasExportarPDF")]
        [HttpGet]
        [AutorizationToken]
        public Documento ExportarReporteInseminacionesPreniadasPDF(string campo, long codigoCampo, string periodo, string usuario)
        {
            try
            {
                return new InseminacionManager().ReporteInseminacionPreniadasExportarPDF(campo, codigoCampo, periodo, usuario);
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

        [Route("api/Reportes/InseminacionPreniadasExportarExcel")]
        [HttpGet]
        [AutorizationToken]
        public Documento ExportarReporteInseminacionesPreniadasExcel(string campo, long codigoCampo, string periodo, string usuario)
        {
            try
            {
                return new InseminacionManager().ReporteInseminacionPreniadasExportarExcel(campo, codigoCampo, periodo, usuario);
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

        [Route("api/Reportes/Eventos")]
        [HttpGet]
        [AutorizationToken]
        public IEnumerable<ReporteEventos> GetReporteEventos(string filtro)
        {
            try
            {
                var filtroDeserealizado = JsonConvert.DeserializeObject<ReporteFilter>(filtro);
                return new EventoManager().GetReporte(filtroDeserealizado);
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

        [Route("api/Reportes/EventosExportarPDF")]
        [HttpGet]
        [AutorizationToken]
        public Documento ExportarReporteEventosPDF(string filtro)
        {
            try
            {
                var filtroDeserealizado = JsonConvert.DeserializeObject<ReporteFilter>(filtro);
                return new EventoManager().ReporteEventosExportarPDF(filtroDeserealizado);
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

        [Route("api/Reportes/EventosExportarExcel")]
        [HttpGet]
        [AutorizationToken]
        public Documento ExportarReporteEventosExcel(string filtro)
        {
            try
            {
                var filtroDeserealizado = JsonConvert.DeserializeObject<ReporteFilter>(filtro);
                return new EventoManager().ReporteEventosExportarExcel(filtroDeserealizado);
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