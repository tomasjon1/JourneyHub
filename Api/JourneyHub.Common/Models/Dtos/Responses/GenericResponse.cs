namespace JourneyHub.Common.Models.Dtos.Responses
{
    public class GenericResponse<T>
    {
        public GenericResponse() { }

        public GenericResponse(T data)
        {
            Data = data;
        }

        public GenericResponse(ErrorResponseDto error)
        {
            Error = error;
        }

        public ErrorResponseDto Error { get; set; }
        public T Data { get; set; }
    }
    public class ErrorResponseDto
    {
        public int StatusCode { get; set; }
        public string Message { get; set; }

        public ErrorResponseDto(int statusCode, string message)
        {
            StatusCode = statusCode;
            Message = message;
        }
    }
}
