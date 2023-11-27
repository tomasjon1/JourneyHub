using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;
using System.Net;
using JourneyHub.Common.Exceptions;
using JourneyHub.Common.Models.Dtos.Responses;
using Newtonsoft.Json;
using System.Text;

namespace JourneyHub.Common.Middleware
{
    public static class ExceptionHandlerMiddleware
    {
        public static async Task InvokeAsync(HttpContext context)
        {
            var exceptionHandlerFeature = context.Features.Get<IExceptionHandlerPathFeature>();
            if (exceptionHandlerFeature?.Error is Exception exception)
            {
                int statusCode;
                string message;

                switch (exception)
                {
                    case BadRequestException badRequestException:
                        statusCode = (int)HttpStatusCode.BadRequest;
                        message = badRequestException.Message;
                        break;
                    default:
                        statusCode = (int)HttpStatusCode.InternalServerError;
                        message = "An unexpected error has occurred.";
                        break;
                }

                context.Response.StatusCode = statusCode;
                context.Response.ContentType = "application/json";

                var errorResponse = new ErrorResponseDto(statusCode, message);
                var response = new GenericResponseDto.GenericResponse<object>(errorResponse);

                var jsonResponse = JsonConvert.SerializeObject(response);
                await context.Response.WriteAsync(jsonResponse, Encoding.UTF8);
            }
        }
    }
}
