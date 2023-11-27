using JourneyHub.Api.Services.Interfaces;
using JourneyHub.Common.Models.Domain;
using JourneyHub.Common.Models.Dtos.Requests;
using JourneyHub.Common.Models.Dtos.Responses;
using Microsoft.AspNetCore.Mvc;

namespace JourneyHub.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TripsController : ControllerBase
    {
        private readonly ITripServices _tripService;

        public TripsController(ITripServices tripService)
        {
            _tripService = tripService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateTripAsync([FromBody] PostTripRequestDto tripDto)
        {
            Trip trip = await _tripService.CreateTripAsync(tripDto);
            return Ok(new GenericResponse<Trip>(trip));
        }

        [HttpPost]
        [Route("Area")]
        public async Task<IActionResult> GetAreByCoordinates([FromBody] getAreaByCoordsDto areaDto)
        {
            String area = await _tripService.getAreaByCoordinates(areaDto);
            return Ok(area);
        }
    }
}
