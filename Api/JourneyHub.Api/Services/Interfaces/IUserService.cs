using JourneyHub.Common.Models.Dtos.Requests;
using Microsoft.AspNetCore.Identity;

namespace JourneyHub.Api.Services.Interfaces
{
    public interface IUserService
    {
        Task<IdentityUser> GetUserByIdAsync(string userId);
        Task<IdentityUser> UpdateUserAsync(IdentityUser user, UserUpdateRequestDto userUpdateDto);
    }
}
