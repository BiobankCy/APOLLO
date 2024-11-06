namespace IMSwebAPI.Models.CustomModels
{
    using System;
    using System.IO;
    using System.Linq;
    using System.Security.Cryptography;
    using System.Text;
    using Microsoft.Extensions.Configuration;

    public class PasswordEncryptionService
    {
        private readonly byte[] keyBytes;

        public PasswordEncryptionService(IConfiguration configuration)
        {
            // Retrieve the JwtAuth key from appsettings.json
            string jwtAuthKey = configuration.GetSection("JwtAuth2:Key").Value;

            // Convert the base64-encoded key to a byte array
            keyBytes = Convert.FromBase64String(jwtAuthKey);
        }

        public string EncryptString(string plainText)
        {
            byte[] plainBytes = Encoding.UTF8.GetBytes(plainText);
            byte[] cipherBytes = null;
            byte[] iv = new byte[16];

            using (var aesAlg = Aes.Create())
            {
                aesAlg.Key = keyBytes;

                // Generate a random IV (Initialization Vector)
                using (var rng = new RNGCryptoServiceProvider())
                {
                    rng.GetBytes(iv);
                }

                aesAlg.IV = iv;

                ICryptoTransform encryptor = aesAlg.CreateEncryptor(aesAlg.Key, aesAlg.IV);

                using (var msEncrypt = new MemoryStream())
                {
                    using (var csEncrypt = new CryptoStream(msEncrypt, encryptor, CryptoStreamMode.Write))
                    {
                        csEncrypt.Write(plainBytes, 0, plainBytes.Length);
                        csEncrypt.FlushFinalBlock();
                        cipherBytes = msEncrypt.ToArray();
                    }
                }
            }

            byte[] encryptedBytes = iv.Concat(cipherBytes).ToArray();
            return Convert.ToBase64String(encryptedBytes);
        }

        public string DecryptString(string encryptedText)
        {
            byte[] encryptedBytes = Convert.FromBase64String(encryptedText);
            byte[] iv = encryptedBytes.Take(16).ToArray();
            byte[] cipherBytes = encryptedBytes.Skip(16).ToArray();
            byte[] plainBytes = new byte[cipherBytes.Length];

            using (var aesAlg = Aes.Create())
            {
                aesAlg.Key = keyBytes;
                aesAlg.IV = iv;

                ICryptoTransform decryptor = aesAlg.CreateDecryptor(aesAlg.Key, aesAlg.IV);

                using (var msDecrypt = new MemoryStream(cipherBytes))
                {
                    using (var csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read))
                    {
                        csDecrypt.Read(plainBytes, 0, plainBytes.Length);
                    }
                }
            }

            return Encoding.UTF8.GetString(plainBytes);
        }
    }

}
