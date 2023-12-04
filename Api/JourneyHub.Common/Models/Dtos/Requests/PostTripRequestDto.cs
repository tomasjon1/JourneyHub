namespace JourneyHub.Common.Models.Dtos.Requests
{
    public class PostTripRequestDto
    {
        public string RouteName { get; set; }
        public string RouteDescription { get; set; }
        public string Visibility { get; set; }
        public List<MapPoint> MapPoints { get; set; }
    }
    public class MapPoint
    {
        public int Order { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
    }
}
