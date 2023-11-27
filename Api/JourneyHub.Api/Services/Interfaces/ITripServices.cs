using JourneyHub.Common.Models.Domain;
using JourneyHub.Common.Models.Dtos.Requests;

namespace JourneyHub.Api.Services.Interfaces
{
    public interface ITripServices
    {
        Task<Trip> CreateTripAsync(PostTripRequestDto tripDto);
    }
}
