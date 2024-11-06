using System.ComponentModel.DataAnnotations;

namespace IMSwebAPI.Models.CustomModels
{
    public class UserLoginDTO
    {

        //public string Username { get; set; } = string.Empty;
        [Display(Name = "Email address")]
        [Required(ErrorMessage = "The email address is required")]
        [EmailAddress(ErrorMessage = "Invalid Email Address")]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;



    }

    public class UserChangePasswordDTO
    {

        [Required]
        public string CurrentPassword { get; set; } = string.Empty;

        [Required]
        public string NewPassword { get; set; } = string.Empty;

    }


}
