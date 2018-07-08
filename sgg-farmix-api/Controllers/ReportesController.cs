using Newtonsoft.Json;
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
        [Route("api/Reportes/Bovinos")]
        [HttpGet]
        [AutorizationToken]
        public IEnumerable<ReporteBovinos> GetReporteBovinos(long codigoCampo, string periodo)
        {
            try
            {
                return new BovinoManager().GetReporte(codigoCampo, periodo);
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
        public Documento ExportarReporteBovinosPDF(string campo, long codigoCampo, string periodo)
        {
            try
            {
                return new BovinoManager().ReporteBovinosExportarPDF(campo, codigoCampo, periodo);
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
        public Documento ExportarReporteBovinosExcel(string campo, long codigoCampo, string periodo)
        {
            try
            {
                return new BovinoManager().ReporteBovinosExportarExcel(campo, codigoCampo, periodo);
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
        public IEnumerable<ReporteInseminacionHembrasServir> GetReporteHembrasServir(long codigoCampo, string periodo)
        {
            try
            {
                return new InseminacionManager().GetReporteHembrasServir(codigoCampo, periodo);
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
        public Documento ExportarReporteInseminacionesHembrasServirPDF(string campo, long codigoCampo, string periodo)
        {
            try
            {
                return new InseminacionManager().ReporteInseminacionHembrasServicioExportarPDF(campo, codigoCampo, periodo);
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
        public Documento ExportarReporteInseminacionesHembrasServirExcel(string campo, long codigoCampo, string periodo)
        {
            try
            {
                return new InseminacionManager().ReporteInseminacionHembrasServicioExportarExcel(campo, codigoCampo, periodo);
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
        public Documento ExportarReporteInseminacionesServiciosSinConfirmarPDF(string campo, long codigoCampo, string periodo)
        {
            try
            {
                return new InseminacionManager().ReporteInseminacionServiciosSinConfirmarExportarPDF(campo, codigoCampo, periodo);
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
        public Documento ExportarReporteInseminacionesServiciosSinConfirmarExcel(string campo, long codigoCampo, string periodo)
        {
            try
            {
                return new InseminacionManager().ReporteInseminacionServiciosSinConfirmarExportarExcel(campo, codigoCampo, periodo);
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
        public Documento ExportarReporteInseminacionesLactanciasPDF(string campo, long codigoCampo, string periodo)
        {
            try
            {
                return new InseminacionManager().ReporteInseminacionLactanciasExportarPDF(campo, codigoCampo, periodo);
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
        public Documento ExportarReporteInseminacionesLactanciasExcel(string campo, long codigoCampo, string periodo)
        {
            try
            {
                return new InseminacionManager().ReporteInseminacionLactanciasExportarExcel(campo, codigoCampo, periodo);
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
        public Documento ExportarReporteInseminacionesPreniadasPDF(string campo, long codigoCampo, string periodo)
        {
            try
            {
                return new InseminacionManager().ReporteInseminacionPreniadasExportarPDF(campo, codigoCampo, periodo);
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
        public Documento ExportarReporteInseminacionesPreniadasExcel(string campo, long codigoCampo, string periodo)
        {
            try
            {
                return new InseminacionManager().ReporteInseminacionPreniadasExportarExcel(campo, codigoCampo, periodo);
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