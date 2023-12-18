using JourneyHub.Common.Models.Domain;
using JourneyHub.Common.Models.Dtos.Requests;
using System.Threading.Tasks;

namespace JourneyHub.Api.Services.Interfaces
{
    public interface ITripServices
    {
        Task<Trip> CreateTripAsync(PostTripRequestDto tripDto, string userId);
        Task<IEnumerable<Trip>> GetAllTripsAsync();
        Task<Trip> GetTripByIdAsync(int id);
        Task<bool> DeleteTripAsync(int id, string userId);
        //Task<Trip> UpdateTripAsync(int id, PostTripRequestDto tripDto);
        Task<AreaInfo> getAreaByCoordinatesAsync(MapPoint mapPoint);
    }
}
