const {
  AUTH_SECRET,
  AUTH_DELAY,
  CORS,
  HTTP_ONLY,
  AUTH_BASE_URL,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_SCOPE,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GITHUB_SCOPE,
  FACEBOOK_CLIENT_ID,
  FACEBOOK_CLIENT_SECRET,
  FACEBOOK_SCOPE,
} = process.env;

export default {
  ...(AUTH_SECRET ? { secret: AUTH_SECRET.split(',') } : {}),
  ...(AUTH_DELAY ? { delay: Number(AUTH_DELAY) } : {}),
  ...(CORS ? { cors: !!CORS } : {}),
  ...(HTTP_ONLY ? { httpOnly: !!HTTP_ONLY } : {}),
  ...(AUTH_BASE_URL ? { authBaseUrl: AUTH_BASE_URL } : {}),
  ...(GOOGLE_CLIENT_ID
    ? {
        google: {
          clientID: GOOGLE_CLIENT_ID,
          clientSecret: GOOGLE_CLIENT_SECRET!,
          scope: GOOGLE_SCOPE ? GOOGLE_SCOPE.split(',') : [],
        },
      }
    : {}),
  ...(GITHUB_CLIENT_ID
    ? {
        github: {
          clientID: GITHUB_CLIENT_ID,
          clientSecret: GITHUB_CLIENT_SECRET!,
          scope: GITHUB_SCOPE ? GITHUB_SCOPE.split(',') : [],
        },
      }
    : {}),
  ...(FACEBOOK_CLIENT_ID
    ? {
        facebook: {
          clientID: FACEBOOK_CLIENT_ID,
          clientSecret: FACEBOOK_CLIENT_SECRET!,
          scope: FACEBOOK_SCOPE ? FACEBOOK_SCOPE.split(',') : [],
        },
      }
    : {}),
};
