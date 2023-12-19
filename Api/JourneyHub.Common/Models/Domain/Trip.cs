using JourneyHub.Common.Models.Dtos.Requests;

namespace JourneyHub.Common.Models.Domain
{
    public class AreaInfo
    {
        public string Country { get; set; }
        public string City { get; set; }
    }

    public class Trip
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public string RouteName { get; set; }
        public string RouteDescription { get; set; }
        public bool IsPrivate { get; set; }
        public List<MapPoint> MapPoints { get; set; }
        public List<MapPoint> MapMarkers { get; set; }
        public AreaInfo Area { get; set; }
        public double Distance { get; set; }
        public double Duration { get; set; }
        public string[] Images { get; set; }
    }
}
