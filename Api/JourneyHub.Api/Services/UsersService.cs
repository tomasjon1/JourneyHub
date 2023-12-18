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

        public async Task<IdentityUser> UpdateUserAsync(IdentityUser user, UserUpdateRequestDto userUpdateDto)
        {
            string emailPattern = @"^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$";

            if (!string.IsNullOrEmpty(userUpdateDto.Email))
            {
                if (!Regex.IsMatch(userUpdateDto.Email, emailPattern))
                    throw new BadRequestException("Invalid email format.");

                user.Email = userUpdateDto.Email;
            }

            if (!string.IsNullOrEmpty(userUpdateDto.UserName))
            {
                var existingUserWithNewUsername = await _userManager.FindByNameAsync(userUpdateDto.UserName);
                if (existingUserWithNewUsername != null && existingUserWithNewUsername.Id != user.Id)
                    throw new BadRequestException("Username already taken.");

                user.UserName = userUpdateDto.UserName;
            }

            var updateResult = await _userManager.UpdateAsync(user);
            if (!updateResult.Succeeded)
                throw new BadRequestException(updateResult.Errors.FirstOrDefault()?.Description);

            if (!string.IsNullOrEmpty(userUpdateDto.CurrentPassword) && !string.IsNullOrEmpty(userUpdateDto.NewPassword))
            {
                if (userUpdateDto.NewPassword != userUpdateDto.ConfirmNewPassword)
                    throw new BadRequestException("New password and confirmation password do not match.");

                var passwordChangeResult = await _userManager.ChangePasswordAsync(user, userUpdateDto.CurrentPassword, userUpdateDto.NewPassword);
                if (!passwordChangeResult.Succeeded)
                    throw new BadRequestException(passwordChangeResult.Errors.FirstOrDefault()?.Description);
            }

            return user;
        }
    }
}
