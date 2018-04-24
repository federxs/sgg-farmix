using System;
using System.Configuration;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json.Linq;
using System.Data;
using System.Data.SqlClient;
using System.Data.Common;
using System.Globalization;

namespace sgg_farmix_helper
{
    public class SqlServerConnection : IConnection
    {
        SqlConnection conn = new SqlConnection(ConfigurationManager.ConnectionStrings["ServerConnection"].ConnectionString);

        public SqlServerConnection()
        {
            conn.Open();
        }

        public object GetValue(string stringSql, List<SqlParameter> parameters = null)
        {
            SqlCommand cmd = new SqlCommand(stringSql, conn);
            cmd.CommandType = CommandType.StoredProcedure;
            try
            {
                if (parameters != null) foreach (var par in parameters) cmd.Parameters.Add(par);
                return cmd.ExecuteScalar();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public IEnumerable<TResult> GetArray<TResult>(string stringSql, List<SqlParameter> parameters)
            where TResult : new()
        {
            var resultado = new List<TResult>();
            var objType = typeof(TResult);
            SqlCommand comando = new SqlCommand(stringSql, conn);
            comando.CommandType = CommandType.StoredProcedure;

            if (parameters != null) foreach (var par in parameters) comando.Parameters.Add(par);

            SqlDataReader dr = null;
            try
            {
                dr = comando.ExecuteReader();
                while (dr.Read())
                {
                    var item = new TResult();
                    for (var i = 0; i < dr.FieldCount; i++)
                    {
                        var pi = objType.GetProperty(dr.GetName(i));
                        if (pi != null && dr.GetValue(i) != System.DBNull.Value) pi.SetValue(item, dr.GetValue(i));
                    }
                    resultado.Add(item);
                }

            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                if (dr != null) dr.Close();
                comando.Dispose();
            }
            return resultado;
        }

        public TResult GetObject<TResult>(long id) where TResult : new()
        {
            TResult result = new TResult();
            var tableAttribute = (EntityAttribute)Attribute.GetCustomAttribute(result.GetType(), typeof(EntityAttribute));
            SqlCommand comando = new SqlCommand(tableAttribute.SpGetName, conn);
            comando.CommandType = CommandType.StoredProcedure;
            var objType = typeof(TResult);
            comando.Parameters.Add(new SqlParameter { ParameterName = tableAttribute.IdGetParamName, Value = id });

            SqlDataReader dr = null;
            try
            {
                dr = comando.ExecuteReader();
                if (dr.Read())
                {
                    for (var i = 0; i < dr.FieldCount; i++)
                    {
                        var pi = objType.GetProperty(dr.GetName(i));
                        if (pi != null && dr.GetValue(i) != System.DBNull.Value) pi.SetValue(result, dr.GetValue(i));
                    }

                }

            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                if (dr != null) dr.Close();
                comando.Dispose();
            }
            return result;
        }

        public int SaveObject<TResult>(TResult obj) where TResult : new()
        {
            var tableAttribute = (EntityAttribute)Attribute.GetCustomAttribute(obj.GetType(), typeof(EntityAttribute));
            SqlCommand cmd = new SqlCommand(tableAttribute.SpSaveName, conn);
            int x = -1;
            cmd.CommandType = CommandType.StoredProcedure;
            var parameters = this.GetParams2(obj);
            foreach (var par in parameters) cmd.Parameters.Add(par);
            try
            {
                x = Convert.ToInt32(cmd.ExecuteScalar());
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                cmd.Dispose();
            }
            return x;
        }


        public IEnumerable<TResult> GetPage<TResult>(out int totalCount, string commandName, object filter)
        where TResult : new()
        {
            var resultado = new List<TResult>();
            var objType = typeof(TResult);

            SqlCommand comando = new SqlCommand(commandName, conn);
            comando.CommandType = CommandType.StoredProcedure;

            var parameters = this.GetParams2(filter);
            foreach (var par in parameters) comando.Parameters.Add(par);
            comando.Parameters.Add(new SqlParameter { ParameterName = "@TotalCount", Value = 0, Direction = ParameterDirection.InputOutput });

            SqlDataReader dr = null;
            try
            {
                dr = comando.ExecuteReader();
                while (dr.Read())
                {
                    var item = new TResult();
                    for (var i = 0; i < dr.FieldCount; i++)
                    {
                        var pi = objType.GetProperty(dr.GetName(i));
                        if (pi != null && dr.GetValue(i) != System.DBNull.Value) pi.SetValue(item, dr.GetValue(i));
                    }
                    resultado.Add(item);
                }

            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                if (dr != null) dr.Close();
                comando.Dispose();
            }
            totalCount = (int)comando.Parameters["@TotalCount"].Value;
            return resultado;
        }
        public JArray GetArray(string stringSql, Dictionary<string, object> parameters = null, CommandType type = CommandType.Text)
        {
            var resultado = new List<string>();

            SqlCommand comando = new SqlCommand(stringSql, conn);
            comando.CommandType = type;

            if (parameters != null)
            {
                foreach (var par in parameters)
                {
                    comando.Parameters.Add(new SqlParameter(par.Key, par.Value));
                }
            }

            SqlDataReader dr;
            dr = comando.ExecuteReader();
            while (dr.Read())
            {
                var item = new List<string>();
                for (var i = 0; i < dr.FieldCount; i++)
                {
                    item.Add("\"" + dr.GetName(i) + "\": \"" + dr.GetValue(i) + "\"");
                }
                resultado.Add("{" + string.Join(",", item.ToArray()) + "}");
            }
            dr.Close();

            return JArray.Parse("[" + string.Join(",", resultado.ToArray()) + "]");
        }

        public IEnumerable<TResult> GetArray<TResult>(string stringSql, Dictionary<string, object> parameters = null, CommandType type = CommandType.Text)
            where TResult : new()
        {
            var resultado = new List<TResult>();

            //if (!bool.Parse(ConfigurationManager.AppSettings["ConsultaBD"])) {
            //    resultado.AddRange(StaticFunctions.GetList<TResult>(10));
            //    return resultado;
            //}

            SqlCommand comando = new SqlCommand(stringSql, conn);
            comando.CommandType = type;

            if (parameters != null)
            {
                foreach (var par in parameters)
                {
                    comando.Parameters.Add(new SqlParameter(par.Key, par.Value));
                }
            }

            SqlDataReader dr;
            dr = comando.ExecuteReader();
            while (dr.Read())
            {
                var item = new List<string>();
                for (var i = 0; i < dr.FieldCount; i++)
                {
                    if (dr.GetFieldType(i).Name == "Decimal")
                        item.Add("\"" + dr.GetName(i) + "\": \"" + dr.GetValue(i).ToString().Replace(',', '.') + "\"");
                    else
                        item.Add("\"" + dr.GetName(i) + "\": \"" + dr.GetValue(i) + "\"");
                }
                resultado.Add(JObject.Parse("{" + string.Join(", ", item.ToArray()) + "}").ToObject<TResult>());
            }
            dr.Close();
            
            return resultado;
        }

        public JArray GetArrayValues(string stringSql, Dictionary<string, object> parameters = null, CommandType type = CommandType.Text)
        {
            var resultado = this.GetArray(stringSql, parameters, type);

            var arr = new List<string>();
            foreach (var item in resultado)
            {
                arr.Add(item.Value<string>());
            }

            return JArray.Parse("[" + string.Join(",", arr.ToArray()) + "]");
        }

        public TResult[] GetArrayValues<TResult>(string stringSql, Dictionary<string, object> parameters = null, CommandType type = CommandType.Text)
        {
            var resultado = this.GetArray(stringSql, parameters, type);

            var arr = new List<TResult>();
            foreach (var item in resultado)
            {
                arr.Add(item.Value<TResult>());
            }

            return arr.ToArray();
        }

        public JObject GetObject(string stringSql, Dictionary<string, object> parameters = null, CommandType type = CommandType.Text, DbTransaction transaction = null)
        {
            var result = "";
            SqlCommand comando = new SqlCommand(stringSql, conn);
            comando.CommandType = type;
            if (transaction != null) comando.Transaction = (SqlTransaction)transaction;
            try
            {
                if (parameters != null)
                {
                    foreach (var par in parameters)
                    {
                        comando.Parameters.Add(new SqlParameter(par.Key, par.Value));
                    }
                }

                SqlDataReader dr;
                dr = comando.ExecuteReader();
                if (dr.Read())
                {
                    var item = new List<string>();
                    for (var i = 0; i < dr.FieldCount; i++)
                    {
                        item.Add("\"" + dr.GetName(i) + "\": \"" + dr.GetValue(i) + "\"");
                    }
                    result = "{" + string.Join(",", item.ToArray()) + "}";
                }
                dr.Close();
                return JObject.Parse(result);
            }
            catch (Exception ex)
            {
                if (transaction != null) comando.Transaction.Rollback();
                throw ex;
            }
        }

        public TResult GetObject<TResult>(string stringSql, System.Collections.Generic.Dictionary<string, object> parameters = null, CommandType type = CommandType.Text, DbTransaction transaction = null) where TResult : new()
        {
            return GetObject(stringSql, parameters, type, transaction).ToObject<TResult>();
        }

        public object GetValue(string stringSql, Dictionary<string, object> parameters = null, CommandType type = CommandType.Text, Int32 paramReturn = 13, DbTransaction transaction = null)
        {
            SqlCommand cmd = new SqlCommand(stringSql, conn);
            cmd.CommandType = CommandType.StoredProcedure;
            if (transaction != null) cmd.Transaction = (SqlTransaction)transaction;
            try
            {
                if (parameters != null)
                {
                    foreach (var par in parameters)
                    {
                        cmd.Parameters.Add(new SqlParameter(par.Key, par.Value));
                    }
                }
                return cmd.ExecuteScalar();

            }
            catch (Exception ex)
            {
                if (transaction != null) cmd.Transaction.Rollback();
                throw ex;
            }
        }

        public int Execute(string stringSql, Dictionary<string, object> parameters = null, CommandType type = CommandType.Text, DbTransaction transaction = null)
        {
            var result = new object();
            SqlCommand cmd = new SqlCommand(stringSql, conn);
            if (transaction != null) cmd.Transaction = (SqlTransaction)transaction;
            try
            {
                cmd.CommandType = type;
                if (parameters != null)
                {
                    foreach (var par in parameters)
                    {
                        cmd.Parameters.Add(new SqlParameter(par.Key, par.Value));
                    }
                }
                return Convert.ToInt32(cmd.ExecuteScalar());
            }
            catch (Exception ex)
            {
                if (transaction != null) cmd.Transaction.Rollback();
                throw ex;
            }
        }

        public DbTransaction BeginTransaction()
        {
            return conn.BeginTransaction();
        }

        public void Commit(DbTransaction transaction)
        {
            transaction.Commit();
        }

        public void Rollback(DbTransaction transaction)
        {
            transaction.Rollback();
        }


        public void Close()
        {
            conn.Close();
        }

        public Dictionary<string, object> GetParams(object pParams)
        {
            var dic = new Dictionary<string, Object>();
            var pi = pParams.GetType().GetProperties();
            foreach (var p in pi)
            {
                var attr = (ParamAttribute)Attribute.GetCustomAttribute(p, typeof(ParamAttribute));
                if (attr != null)
                {
                    dic.Add(attr.ParamName, p.GetValue(pParams));
                }
            }
            return dic;
        }

        public List<SqlParameter> GetParams2(object pParams)
        {
            var dic = new List<SqlParameter>();
            var pi = pParams.GetType().GetProperties();
            foreach (var p in pi)
            {
                var attr = (ParamAttribute)Attribute.GetCustomAttribute(p, typeof(ParamAttribute));
                if (attr != null)
                {
                    var v = p.GetValue(pParams);
                    if (attr.ConvertTo != null)
                    {
                        if (v != null && !string.IsNullOrEmpty(v.ToString())) v = Convert.ChangeType(v, attr.ConvertTo, new CultureInfo("es-AR"));
                    }
                    dic.Add(new SqlParameter { ParameterName = attr.ParamName, Value = v == null ? System.DBNull.Value : v });
                }


            }
            return dic;
        }


        public List<string> GetTable(string strSql, Dictionary<string, object> parameters = null, CommandType type = CommandType.Text)
        {
            throw new NotImplementedException();
        }


        public object GetValue2(string stringSql, IDataParameterCollection parameters = null, CommandType type = CommandType.Text, int paramReturn = 13, DbTransaction transaction = null)
        {
            throw new NotImplementedException();
        }


        public void GetValue3(IDbCommand cmd)
        {
            throw new NotImplementedException();
        }
    }
}