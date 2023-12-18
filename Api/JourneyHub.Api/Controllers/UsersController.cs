using JourneyHub.Api.Services.Interfaces;
using JourneyHub.Common.Models.Dtos.Requests;
using JourneyHub.Common.Models.Dtos.Responses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace JourneyHub.Api.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        public async Task<IActionResult> GetUserDetails()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _userService.GetUserByIdAsync(userId);

            return Ok(new GenericResponse<GetUserInfoDto>(new GetUserInfoDto
                {
                    UserName = user.UserName,
                    Email = user.Email
                }
            ));
        }

        [HttpPut]
        public async Task<IActionResult> UpdateUserDetails([FromBody] UserUpdateRequestDto updateUserDto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _userService.GetUserByIdAsync(userId);

            var updatedUser = await _userService.UpdateUserAsync(user, updateUserDto);

            return Ok(new GenericResponse<GetUserInfoDto>(new GetUserInfoDto
                {
                    UserName = user.UserName,
                    Email = user.Email
                }
            ));
        }
    }
}