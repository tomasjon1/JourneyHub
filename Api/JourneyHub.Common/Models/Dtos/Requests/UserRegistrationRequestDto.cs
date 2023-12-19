using System.ComponentModel.DataAnnotations;

namespace JourneyHub.Common.Models.Dtos.Requests
{
    public class UserRegistrationRequestDto
    {
        [Required] public string Name { get; set; }

        [Required] [EmailAddress] public string Email { get; set; }

        [Required] public string Password { get; set; }

        [Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
        public string ConfirmPassword { get; set; }
    }
}