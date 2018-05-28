using System;
using System.Collections.Generic;
using System.Configuration;
using System.Net;
using System.Net.Http;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;

namespace sgg_farmix_helper
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
                    parametros = new Dictionary<string, object>
                    {
                        //{"@nombreApp", null },
                        {"@token", param }
                        //{"@TokenVigencia", int.Parse(ConfigurationManager.AppSettings["TokenVigencia"]) }
                    };

                    validar = connection.Execute("spValidarToken", parametros, System.Data.CommandType.StoredProcedure);

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
