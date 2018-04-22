using Newtonsoft.Json.Linq;
using System.Data.OracleClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Data.Common;
using System.Configuration;

namespace Sooft.Enterprise.Rocket.DataAccess
{
   public class OracleConnection: IConnection
    {
        OracleConnection conn = new OracleConnection(ConfigurationManager.ConnectionStrings["Default"].ConnectionString);

        public SooftOracleConnection()
        {
            conn.Open();
        }

        public JArray GetArray(string strSql, Dictionary<string, object> parameters = null, CommandType type = CommandType.Text)
        {
            var result = new List<string>();

            OracleCommand cmd = new OracleCommand(strSql, conn);
            cmd.CommandType = CommandType.Text;
            if (parameters != null)
            {
                foreach (var par in parameters)
                {
                    cmd.Parameters.Add(new OracleParameter(par.Key, par.Value));
                }
            }
            OracleDataReader dr;
            if (type == CommandType.Text)
            {
                dr = cmd.ExecuteReader();
            }
            else {
                cmd.Parameters.Add(new OracleParameter("io_cursor", OracleType.Cursor)).Direction = ParameterDirection.Output;
                cmd.ExecuteNonQuery();
                dr = (OracleDataReader)cmd.Parameters["io_cursor"].Value;
            }
            while (dr.Read())
            {
                var item = new List<string>();
                for (var i = 0; i < dr.FieldCount; i++)
                {
                    item.Add("\"" + dr.GetName(i) + "\": \"" + dr.GetValue(i) + "\"");
                }
                result.Add("{" + string.Join(",", item.ToArray()) + "}");
            }
            dr.Close();
            dr.Dispose();

            return JArray.Parse("[" + string.Join(",", result.ToArray()) + "]");
        }
        public IEnumerable<TResult> GetArray<TResult>(string strSql, Dictionary<string, object> parameters = null, CommandType type = CommandType.Text)
            where TResult : new()
        {
            var result = new List<TResult>();

            OracleCommand cmd = new OracleCommand(strSql, conn);
            cmd.CommandType = CommandType.Text;
            if (parameters != null)
            {
                foreach (var par in parameters)
                {
                    cmd.Parameters.Add(new OracleParameter(par.Key, par.Value));
                }
            }
            OracleDataReader dr;
            if (type == CommandType.Text)
            {
                dr = cmd.ExecuteReader();
            }
            else
            {
                cmd.Parameters.Add(new OracleParameter("io_cursor", OracleType.Cursor)).Direction = ParameterDirection.Output;
                cmd.ExecuteNonQuery();
                dr = (OracleDataReader)cmd.Parameters["io_cursor"].Value;
            }
            while (dr.Read())
            {
                var item = new List<string>();
                for (
                    var i = 0; i < dr.FieldCount; i++)
                {
                    item.Add("\"" + dr.GetName(i) + "\": \"" + dr.GetValue(i) + "\"");
                }
                result.Add(JObject.Parse("{" + string.Join(", ", item.ToArray()) + "}").ToObject<TResult>());
            }
            dr.Close();
            dr.Dispose();
            return result;
        }
        public JArray GetArrayValues(string strSql, Dictionary<string, object> parameters = null, CommandType type = CommandType.Text)
        {
            var result = this.GetArray(strSql, parameters, type);

            var arr = new List<string>();
            foreach (var i in result) {
                arr.Add(i.Values().First().Value<string>());
            }

            return JArray.Parse("[" + string.Join(",", arr.ToArray()) + "]");
        }
        public JObject GetObject(string strSql, Dictionary<string, object> parameters = null, CommandType type = CommandType.Text, DbTransaction transaction = null)
        {
            var result = "";
            OracleCommand cmd = new OracleCommand(strSql, conn);
            cmd.CommandType = type;
            if (transaction != null) cmd.Transaction = (OracleTransaction) transaction;
            try
            {
                if (parameters != null)
                {
                    foreach (var par in parameters)
                    {
                        cmd.Parameters.Add(new OracleParameter(par.Key, par.Value));
                    }
                }
                OracleDataReader dr;
                if (type == CommandType.Text)
                {
                    dr = cmd.ExecuteReader();
                }
                else
                {
                    cmd.Parameters.Add(new OracleParameter("io_cursor", OracleType.Cursor)).Direction = ParameterDirection.Output;
                    cmd.ExecuteNonQuery();
                    dr = (OracleDataReader)cmd.Parameters["io_cursor"].Value;
                }
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
                dr.Dispose();
                return JObject.Parse(result);
            }
            catch (Exception ex)
            {
                if (transaction != null) cmd.Transaction.Rollback();
                throw ex;
            }

        }
        public object GetValue(string strSql, Dictionary<string, object> parameters = null, CommandType type = CommandType.Text, Int32 paramReturn = 13, DbTransaction transaction = null)
        {
            OracleCommand cmd = new OracleCommand(strSql, conn);
            cmd.CommandType = type;
            if (transaction != null) cmd.Transaction = (OracleTransaction) transaction;
            try
            {
                if (parameters != null)
                {
                    foreach (var par in parameters)
                    {
                        cmd.Parameters.Add(new OracleParameter(par.Key, par.Value));
                    }
                }
                if (type == CommandType.Text)
                {
                    return cmd.ExecuteScalar();
                }
                else
                {
                    cmd.Parameters.Add(new OracleParameter("io_value", (OracleType)paramReturn)).Direction = ParameterDirection.Output;
                    if (paramReturn == 14) cmd.Parameters["io_value"].Size = 100;
                    cmd.ExecuteNonQuery();
                    return cmd.Parameters["io_value"].Value;
                }
            }
            catch (Exception ex)
            {
                if (transaction != null) cmd.Transaction.Rollback();
                throw ex;
            }
        }
        public TResult GetValue<TResult>(string strSql, Dictionary<string, object> parameters = null, CommandType type = CommandType.Text, DbTransaction transaction = null)
        {
            return GetObject(strSql, parameters, type, transaction).ToObject<TResult>();
        }
        public int Execute(string strSql, Dictionary<string, object> parameters = null, CommandType type = CommandType.Text, DbTransaction transaction = null)
        {
            var result = new object();
            OracleCommand cmd = new OracleCommand(strSql, conn);
            if (transaction != null) cmd.Transaction = (OracleTransaction) transaction;
            try {
                cmd.CommandType = type;
                if (parameters != null)
                {
                    foreach (var par in parameters)
                    {
                        cmd.Parameters.Add(new OracleParameter(par.Key, par.Value));
                    }
                }
                return cmd.ExecuteNonQuery();
            }
            catch (Exception ex) {
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



        public TResult[] GetArrayValues<TResult>(string stringSql, Dictionary<string, object> parameters = null, CommandType type = CommandType.Text)
        {
            //throw new NotImplementedException();
            var resultado = this.GetArray(stringSql, parameters, type);

            var arr = new List<TResult>();
            foreach (var item in resultado)
            {
                arr.Add(item.Values().First().Value<TResult>());
                
                //((Newtonsoft.Json.Linq.JArray)resultado).Select(item => (TResult)item.Value<TResult>()).ToArray();
            }

            return arr.ToArray();
        }

        public TResult GetObject<TResult>(string stringSql, Dictionary<string, object> parameters = null, CommandType type = CommandType.Text, DbTransaction transaction = null) where TResult : new()
        {
            var list = GetArray<TResult>(stringSql, parameters, type);
            if (list.Count() > 0) return list.First();
            else return new TResult();
        }

        public List<string> GetTable(string strSql, Dictionary<string, object> parameters = null, CommandType type = CommandType.Text)
        {
            var cabecera = "";
            var result = "";

            OracleCommand cmd = new OracleCommand(strSql, conn);
            cmd.CommandType = CommandType.Text;
            if (parameters != null)
            {
                foreach (var par in parameters)
                {
                    cmd.Parameters.Add(new OracleParameter(par.Key, par.Value));
                }
            }
            OracleDataReader dr;
            if (type == CommandType.Text)
            {
                dr = cmd.ExecuteReader();
            }
            else
            {
                cmd.Parameters.Add(new OracleParameter("io_cursor", OracleType.Cursor)).Direction = ParameterDirection.Output;
                cmd.ExecuteNonQuery();
                dr = (OracleDataReader)cmd.Parameters["io_cursor"].Value;
            }
            var cant = 0;
            while (dr.Read())
            {
                if (cant == 0)
                {
                    var cab = "<tr>";
                    for (var i = 0; i < dr.FieldCount; i++)
                    {
                        cab += "<th>" + dr.GetName(i) + "</th>";
                    }
                    cab += "</tr>";
                    cabecera += cab;
                }
                cant++;
                var item = "<tr>";
                for (var i = 0; i < dr.FieldCount; i++)
                {
                    item += "<td>" + dr.GetValue(i) + "</td>";
                }
                item += "</tr>";
                result += item;
            }
            dr.Close();
            dr.Dispose();

            var resultado = new List<string>();
            resultado.Add(cabecera);
            resultado.Add(result);
            return resultado;
        }



        public object GetValue2(string strSql, IDataParameterCollection parameters = null, CommandType type = CommandType.Text, int paramReturn = 13, DbTransaction transaction = null)
        {
            OracleCommand cmd = new OracleCommand(strSql, conn);
            cmd.CommandType = type;
            if (transaction != null) cmd.Transaction = (OracleTransaction)transaction;
            try
            {
                if (parameters != null)
                {
                    foreach (var par in parameters)
                    {
                        cmd.Parameters.Add(par);
                    }
                }
                if (type == CommandType.Text)
                {
                    return cmd.ExecuteScalar();
                }
                else
                {
                    cmd.Parameters.Add(new OracleParameter("io_value", (OracleType)paramReturn)).Direction = ParameterDirection.Output;
                    if (paramReturn == 14) cmd.Parameters["io_value"].Size = 100;
                    cmd.ExecuteNonQuery();
                    return cmd.Parameters["io_value"].Value;
                }
            }
            catch (Exception ex)
            {
                if (transaction != null) cmd.Transaction.Rollback();
                throw ex;
            }
        }

        public void GetValue3(IDbCommand cmd)
        {
            try
            {
                    cmd.Connection = conn;
                    cmd.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}