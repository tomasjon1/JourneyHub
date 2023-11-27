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
}