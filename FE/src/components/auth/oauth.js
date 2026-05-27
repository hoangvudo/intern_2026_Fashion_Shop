const GOOGLE_CLIENT_ID =
  '779501654477-f87uq2sl46hv6da4lc6s53db5uclvahc.apps.googleusercontent.com'
const FACEBOOK_CLIENT_ID = '975365101857178'
const API_ORIGIN = 'http://localhost:8080'

export function redirectToGoogleOAuth() {
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: `${API_ORIGIN}/api/auth/oauth2/google/callback`,
    response_type: 'code',
    scope: 'openid email profile',
  })
  window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params}`
}

export function redirectToFacebookOAuth() {
  const params = new URLSearchParams({
    client_id: FACEBOOK_CLIENT_ID,
    redirect_uri: `${API_ORIGIN}/api/auth/oauth2/facebook/callback`,
    response_type: 'code',
    scope: 'public_profile,email',
  })
  window.location.href = `https://www.facebook.com/v18.0/dialog/oauth?${params}`
}
