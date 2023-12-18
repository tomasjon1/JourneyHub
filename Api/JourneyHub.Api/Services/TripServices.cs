using AutoMapper;
using JourneyHub.Api.Services.Interfaces;
using JourneyHub.Common.Models.Domain;
using JourneyHub.Common.Models.Dtos.Requests;
using JourneyHub.Data;
using Microsoft.EntityFrameworkCore;
using System.Net.Http.Headers;
using System.Text.RegularExpressions;

namespace JourneyHub.Api.Services
{
    public class TripServices : ITripServices
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public TripServices(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Trip> CreateTripAsync(PostTripRequestDto tripDto)
        {
            Trip trip = _mapper.Map<Trip>(tripDto);

            trip.Area = await getAreaByCoordinatesAsync(tripDto.MapPoints[0]);
            _context.Trips.Add(trip);
            await _context.SaveChangesAsync();

            return trip;
        }

        public async Task<IEnumerable<Trip>> GetAllTripsAsync()
        {
            return await _context.Trips
                                .AsNoTracking()
                                .Select(trip => new Trip
                                {
                                    Id = trip.Id,
                                    RouteName = trip.RouteName,
                                    RouteDescription = trip.RouteDescription,
                                    Visibility = trip.Visibility,
                                    Distance = trip.Distance,
                                    Duration = trip.Duration,
                                    Area = trip.Area
                                })
                                .ToListAsync();
        }

        public async Task<Trip> GetTripByIdAsync(int id)
        {
            return await _context.Trips.FindAsync(id);
        }

        public async Task<bool> DeleteTripAsync(int id)
        {
            var trip = await _context.Trips.FindAsync(id);
            if (trip == null)
            {
                return false;
            }

            _context.Trips.Remove(trip);
            await _context.SaveChangesAsync();

            return true;
        }

        //public async Task<Trip> UpdateTripAsync(int id, PostTripRequestDto tripDto)
        //{
        //    var trip = await _context.Trips.FindAsync(id);
        //    if (trip == null)
        //    {
        //        return null;
        //    }

        //    _mapper.Map(tripDto, trip);

        //    _context.Trips.Update(trip);
        //    await _context.SaveChangesAsync();

        //    return trip;
        //}

        public async Task<AreaInfo> getAreaByCoordinatesAsync(MapPoint MapPoint)
        {
            string _address = "https://nominatim.openstreetmap.org/reverse?lat=" + MapPoint.Lat.ToString() + "&lon=" + MapPoint.Lng.ToString() + "&format=json";

            var client = new HttpClient();

            var productValue = new ProductInfoHeaderValue("ScraperBot", "1.0");
            var commentValue = new ProductInfoHeaderValue("(+http://www.example.com/ScraperBot.html)");

            client.DefaultRequestHeaders.UserAgent.Add(productValue);
            client.DefaultRequestHeaders.UserAgent.Add(commentValue);

            client.BaseAddress = new Uri(_address);
            HttpResponseMessage response = await client.GetAsync(new Uri(_address));
            response.EnsureSuccessStatusCode();
            var result = await response.Content.ReadAsStringAsync();
            
            string patterncountry = @"""\bcountry\b"":""([^""]+)""";
            string patterncity = @"""\bcity\b"":""([^""]+)""";

            Match matchCountry = Regex.Match(result, patterncountry);
            string countryName = matchCountry.Groups[1].Value;

            Match matchCity = Regex.Match(result, patterncity);
            string cityName = matchCity.Groups[1].Value;


            return new AreaInfo { Country = countryName, City = cityName };
        }
    }
}
