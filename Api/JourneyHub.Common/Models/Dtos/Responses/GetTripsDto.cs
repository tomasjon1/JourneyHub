using JourneyHub.Common.Models.Domain;

namespace JourneyHub.Common.Models.Dtos.Responses
{
    public class GetTripsResponseDto
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public string RouteName { get; set; }
        public string RouteDescription { get; set; }
        public double Distance { get; set; }
        public double Duration { get; set; }
        public AreaInfo Area { get; set; }
        public string[] Images { get; set; }
    }
}