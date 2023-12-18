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
        public string RouteName { get; set; }
        public string RouteDescription { get; set; }
        public string Visibility { get; set; }
        public string MapPoints { get; set; }
        public string MapMarkers { get; set; }
        public AreaInfo Area { get; set; }
        public double Distance { get; set; }
        public double Duration { get; set; }
    }
}
