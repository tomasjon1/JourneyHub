using System.ComponentModel.DataAnnotations;

namespace JourneyHub.Common.Models.Dtos.Responses
{
    public class UserLoginRequestDto
    {
        [Required]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }
    }
}
