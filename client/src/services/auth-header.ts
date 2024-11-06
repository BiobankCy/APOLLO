export default function authHeader(contentType?: string) {
  const userStr = localStorage.getItem("user");
  let user = null;
  if (userStr) user = JSON.parse(userStr);

  const headers: { [key: string]: string } = {};

  if (user && user.accessToken) {
    headers["Authorization"] = "Bearer " + user.accessToken;
  }

  if (contentType) {
    headers["Content-Type"] = contentType;
  }

  return headers;
}
