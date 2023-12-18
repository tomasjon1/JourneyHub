using JourneyHub.Api.Services.Interfaces;
using JourneyHub.Common.Models.Domain;
using JourneyHub.Common.Models.Dtos.Requests;
using JourneyHub.Common.Models.Dtos.Responses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

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
        [Authorize]
        public async Task<IActionResult> CreateTripAsync([FromBody] PostTripRequestDto tripDto)
        {
            string userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            Trip trip = await _tripService.CreateTripAsync(tripDto, userId);
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
        [Authorize]
        public async Task<IActionResult> DeleteTripAsync(int id)
        {
            string userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var result = await _tripService.DeleteTripAsync(id, userId);
            if (!result)
            {
                return NotFound();
            }

            return Ok();
        }
    }
}