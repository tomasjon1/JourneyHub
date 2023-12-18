namespace JourneyHub.Common.Exceptions
{
    public class BadRequestException : Exception
    {
        public int StatusCode { get; set; }
        public BadRequestException(){}
        public BadRequestException(string message) : base(message){}
        public BadRequestException(string message, int statusCode) : base(message)
        {
            StatusCode = statusCode;
        }
    }

    public class UnauthorizedException : Exception
    {
        public int StatusCode { get; set; }

        public UnauthorizedException() { }

        public UnauthorizedException(string message) : base(message) { }

        public UnauthorizedException(string message, int statusCode) : base(message)
        {
            StatusCode = statusCode;
        }
    }
}