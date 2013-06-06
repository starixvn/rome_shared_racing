namespace Fanex.PTRacing.BusinessObjects
{
    using System;

    [Serializable]
    public class Result
    {
        public Result()
            : this(string.Empty, string.Empty)
        {
        }

        public Result(string errorCode, string errorMessage)
        {
            this.ErrorCode = errorCode;
            this.ErrorMessage = errorMessage;
        }

        public string ErrorCode
        {
            get;
            set;
        }

        public string ErrorMessage
        {
            get;
            set;
        }
    }
}