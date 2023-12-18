using JourneyHub.Common.Models.Domain;
using JourneyHub.Common.Models.Dtos.Requests;
using System.Threading.Tasks;

namespace JourneyHub.Api.Services.Interfaces
{
    public interface ITripServices
    {
        Task<Trip> CreateTripAsync(PostTripRequestDto tripDto);
        Task<IEnumerable<Trip>> GetAllTripsAsync();
        Task<Trip> GetTripByIdAsync(int id);
        Task<bool> DeleteTripAsync(int id);
        //Task<Trip> UpdateTripAsync(int id, PostTripRequestDto tripDto);
        Task<AreaInfo> getAreaByCoordinatesAsync(MapPoint mapPoint);
    }
}
