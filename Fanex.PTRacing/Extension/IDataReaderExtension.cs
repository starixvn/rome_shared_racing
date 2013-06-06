namespace Fanex.PTRacing
{
    using System;
    using System.Data;

    public static class IDataReaderExtension
    {
        public static bool HasColumn(this IDataReader reader, string columnName)
        {
            reader.GetSchemaTable().DefaultView.RowFilter = "ColumnName= '" + columnName + "'";
            return reader.GetSchemaTable().DefaultView.Count > 0;
        }

        public static string ToString(this IDataReader reader, string columnName)
        {
            if (reader.HasColumn(columnName) && reader[columnName] != null)
            {
                return reader[columnName].ToString();
            }

            return string.Empty;
        }

        public static bool ToBoolean(this IDataReader reader, string columnName)
        {
            if (reader.HasColumn(columnName) && reader[columnName] != null)
            {
                return Convert.ToBoolean(reader[columnName]);
            }

            return false;
        }

        public static decimal ToDecimal(this IDataReader reader, string columnName)
        {
            if (reader.HasColumn(columnName) && reader[columnName] != null)
            {
                return Convert.ToDecimal(reader[columnName]);
            }

            return 0;
        }
    }
}