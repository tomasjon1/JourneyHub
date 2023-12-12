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

        [HttpGet]
        public async Task<IActionResult> GetAllTripsAsync()
        {
            var trips = await _tripService.GetAllTripsAsync();
            return Ok(new GenericResponse<IEnumerable<Trip>>(trips));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetTripByIdAsync(int id)
        {
            var trip = await _tripService.GetTripByIdAsync(id);
            if (trip == null)
            {
                return NotFound();
            }

            return Ok(new GenericResponse<Trip>(trip));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTripAsync(int id)
        {
            var result = await _tripService.DeleteTripAsync(id);
            if (!result)
            {
                return NotFound();
            }

            return Ok();
        }

        //[HttpPut("{id}")]
        //public async Task<IActionResult> UpdateTripAsync(int id, [FromBody] PostTripRequestDto tripDto)
        //{
        //    var updatedTrip = await _tripService.UpdateTripAsync(id, tripDto);
        //    if (updatedTrip == null)
        //    {
        //        return NotFound();
        //    }

        //    return Ok(new GenericResponse<Trip>(updatedTrip));
        //}
    }
}
