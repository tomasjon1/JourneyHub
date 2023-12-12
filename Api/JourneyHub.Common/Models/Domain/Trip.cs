namespace JourneyHub.Common.Models.Domain
{
    public class Trip
    {
        public int Id { get; set; }
        public string RouteName { get; set; }
        public string RouteDescription { get; set; }
        public string Visibility { get; set; }
        public string MapPoints { get; set; }
        public string Area { get; set; }
    }
}
