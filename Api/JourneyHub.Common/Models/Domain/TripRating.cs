namespace JourneyHub.Common.Models.Domain
{
    public class TripRating
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public int TripId { get; set; }
        public int Rating { get; set; }
        public string Comment { get; set; }
    }
}