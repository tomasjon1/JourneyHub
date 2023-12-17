using JourneyHub.Common.Models.Dtos.Requests;
namespace JourneyHub.Common.Models.Dtos.Requests
{
    public class PostTripRequestDto
    {
        public string RouteName { get; set; }
        public string RouteDescription { get; set; }
        public string Visibility { get; set; }
        public List<MapPoint> MapPoints { get; set; }
        public List<MapPoint> MapMarkers {get; set; }
    }
    public class MapPoint
    {
        public double Lat { get; set; }
        public double Lng { get; set; }
    }
}
