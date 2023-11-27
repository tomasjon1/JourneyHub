using AutoMapper;
using JourneyHub.Api.Services.Interfaces;
using JourneyHub.Common.Models.Domain;
using JourneyHub.Common.Models.Dtos.Requests;
using JourneyHub.Data;

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
    }
}
