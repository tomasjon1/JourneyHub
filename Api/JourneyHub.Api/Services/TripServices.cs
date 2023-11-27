using AutoMapper;
using JourneyHub.Api.Services.Interfaces;
using JourneyHub.Common.Models.Domain;
using JourneyHub.Common.Models.Dtos.Requests;
using JourneyHub.Data;
using System;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;

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

            _context.Trips.Add(trip);
            await _context.SaveChangesAsync();

            return trip;
        }

        public async Task<string> getAreaByCoordinates(getAreaByCoordsDto areadto)
        {
            string lon = areadto.lon.ToString();
            string lat = areadto.lat.ToString();

            string _address = "https://nominatim.openstreetmap.org/reverse?lat="+ lat + "&lon="+ lon + "&format=json";

            var client = new HttpClient();

            var productValue = new ProductInfoHeaderValue("ScraperBot", "1.0");
            var commentValue = new ProductInfoHeaderValue("(+http://www.example.com/ScraperBot.html)");

            client.DefaultRequestHeaders.UserAgent.Add(productValue);
            client.DefaultRequestHeaders.UserAgent.Add(commentValue);


            client.BaseAddress = new Uri(_address);
            HttpResponseMessage response = await client.GetAsync(new Uri(_address));
            response.EnsureSuccessStatusCode();
            var result = await response.Content.ReadAsStringAsync();


            return result;
        }
    }
}
