const {
  AUTH_SECRET,
  AUTH_DELAY,
  CORS,
  AUTH_BASE_URL,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_SCOPE,
  TWITTER_CONSUMER_KEY,
  TWITTER_CONSUMER_SECRET,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GITHUB_SCOPE,
} = process.env;

export default {
  ...(AUTH_SECRET ? { secret: AUTH_SECRET.split(',') } : {}),
  ...(AUTH_DELAY ? { delay: Number(AUTH_DELAY) } : {}),
  ...(CORS ? { cors: !!CORS } : {}),
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
  ...(TWITTER_CONSUMER_KEY
    ? {
        twitter: {
          consumerKey: TWITTER_CONSUMER_KEY,
          consumerSecret: TWITTER_CONSUMER_SECRET!,
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
};
