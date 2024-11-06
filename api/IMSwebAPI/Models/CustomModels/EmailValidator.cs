using System.Text.RegularExpressions;

namespace IMSwebAPI.Models.CustomModels
{
    public class EmailValidator
    {
        public static bool IsValidEmail(string email)
        {
            // Regular expression pattern for email validation
            string pattern = @"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$";

            // Check if the email matches the pattern
            bool isMatch = Regex.IsMatch(email, pattern);

            return isMatch;
        }
    }



}
