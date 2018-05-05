using sgg_farmix_acceso_datos.Helper;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;

namespace sgg_farmix_acceso_datos
{
    public class AutorizationTokenAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(HttpActionContext actionContext)
        {
            SqlServerConnection connection = new SqlServerConnection();
            Dictionary<string, object> parametros;
            try
            {
                var param = actionContext.Request.Headers.Authorization == null ? "" : actionContext.Request.Headers.Authorization.ToString();
                if (param.Length == 0)
                {
                    actionContext.Response = new HttpResponseMessage(HttpStatusCode.NotAcceptable)
                    {
                        Content = new StringContent(string.Format("Token_Invalido")),
                        ReasonPhrase = "Token_Invalido"
                    };
                }
                else
                {
                    long validar = 0;
                    if (!param.Contains("-"))
                    {
                        parametros = new Dictionary<string, object>
                        {
                            {"@NombreApp", null },
                            {"@Usu_Token", param },
                            {"@TokenVigencia", int.Parse(ConfigurationManager.AppSettings["TokenVigencia"]) }
                        };

                        validar = connection.Execute("Token_Validar", parametros, System.Data.CommandType.StoredProcedure);
                    }
                    else
                    {
                        var nombreApp = param.Split('-')[1];
                        if (nombreApp.Equals("5") || nombreApp.Equals("10067"))
                            validar = 1;
                        else
                        {
                            parametros = new Dictionary<string, object>
                            {
                                {"@NombreApp", nombreApp },
                                {"@Usu_Token", param.Split('-')[0] },
                                {"@TokenVigencia", 0 }
                            };
                            validar = connection.Execute("Token_Validar", parametros, System.Data.CommandType.StoredProcedure);
                        }
                    }

                    if (validar == 0)
                    {
                        actionContext.Response = new HttpResponseMessage(HttpStatusCode.NotAcceptable)
                        {
                            Content = new StringContent(string.Format("Token_Invalido")),
                            ReasonPhrase = "Token_Invalido"
                        };
                    }
                }
            }
            catch (Exception)
            {
                actionContext.Response = new HttpResponseMessage(HttpStatusCode.NotAcceptable)
                {
                    Content = new StringContent(string.Format("Token_Invalido")),
                    ReasonPhrase = "Token_Invalido"
                };
            }
            finally
            {
                parametros = null;
                connection.Close();
            }
        }
    }
}
