namespace Fanex.PTRacing.DataAccess
{
    using System;
    using System.Data;
    using System.Data.Common;
    using Fanex.PTRacing.BusinessObjects;
    using Microsoft.Practices.EnterpriseLibrary.Data;

    public abstract class DataAccessBase
    {
        public void AddResultParams(Database db, DbCommand command)
        {
            db.AddOutParameter(command, "errcode", DbType.String, 300);
            db.AddOutParameter(command, "errmsg", DbType.String, 0xfa0);
        }

        public Result GetResultParams(Database db, DbCommand command)
        {
            object parameterValue = db.GetParameterValue(command, "errcode");
            parameterValue = (parameterValue is DBNull) ? string.Empty : Convert.ToString(parameterValue);
            object obj3 = db.GetParameterValue(command, "errmsg");
            obj3 = (obj3 is DBNull) ? string.Empty : Convert.ToString(obj3);
            return new Result((string)parameterValue, (string)obj3);
        }
    }
}