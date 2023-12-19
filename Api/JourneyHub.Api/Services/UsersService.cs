using JourneyHub.Api.Services.Interfaces;
using JourneyHub.Common.Exceptions;
using JourneyHub.Common.Models.Dtos.Requests;
using Microsoft.AspNetCore.Identity;
using System.Text.RegularExpressions;

namespace JourneyHub.Api.Services
{
    public class UsersService : IUserService
    {
        private readonly UserManager<IdentityUser> _userManager;

        public UsersService(UserManager<IdentityUser> userManager)
        {
            _userManager = userManager;
        }

        public async Task<IdentityUser> GetUserByIdAsync(string userId)
        {
            return await _userManager.FindByIdAsync(userId);
        }
        
                public async Task<bool> DeleteCurrentUserAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return false;
            }

            var result = await _userManager.DeleteAsync(user);
            return result.Succeeded;
        }
public async Task<IdentityUser> UpdateUserAsync(IdentityUser user, UserUpdateRequestDto userUpdateDto)
{
    string emailPattern = @"^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$";

    // Update Email
    if (!string.IsNullOrEmpty(userUpdateDto.Email))
    {
        if (!Regex.IsMatch(userUpdateDto.Email, emailPattern))
            throw new BadRequestException("Invalid email format.");

        user.Email = userUpdateDto.Email;
    }

    // Update Username
    if (!string.IsNullOrEmpty(userUpdateDto.UserName))
    {
        var existingUserWithNewUsername = await _userManager.FindByNameAsync(userUpdateDto.UserName);
        if (existingUserWithNewUsername != null && existingUserWithNewUsername.Id != user.Id)
            throw new BadRequestException("Username already taken.");

        user.UserName = userUpdateDto.UserName;
    }

    // Update user and return result
    var updateResult = await _userManager.UpdateAsync(user);
    if (!updateResult.Succeeded)
        throw new BadRequestException(updateResult.Errors.FirstOrDefault()?.Description);

    return user;
}



              public async Task<bool> VerifyUserPasswordAsync(string userId, string password)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return false;
            }

            return await _userManager.CheckPasswordAsync(user, password);
        }
    }
    }

    

