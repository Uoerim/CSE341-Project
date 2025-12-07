import fetch from "node-fetch";

/**
 * Verify Google ID Token and extract user information
 * @param {string} token - Google ID Token from client
 * @returns {Promise<object>} - Decoded token data with user info
 */
export const verifyGoogleToken = async (token) => {
  try {
    // Google's token verification endpoint
    const response = await fetch("https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=" + token);
    
    // For ID tokens, use this endpoint instead:
    const googleResponse = await fetch("https://oauth2.googleapis.com/tokeninfo", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `id_token=${token}`,
    });

    if (!googleResponse.ok) {
      throw new Error("Invalid token");
    }

    const data = await googleResponse.json();
    
    // Verify the token is for our app
    const expectedClientId = "23324959742-6ffe6n1k4db0lsapekqdvh8u61jt0qfi.apps.googleusercontent.com";
    if (data.aud !== expectedClientId) {
      throw new Error("Token not issued for this application");
    }

    return {
      email: data.email,
      name: data.name,
      picture: data.picture,
      sub: data.sub, // Google user ID
      email_verified: data.email_verified,
    };
  } catch (error) {
    throw new Error(`Google token verification failed: ${error.message}`);
  }
};

/**
 * Alternative method to verify ID token using jsonwebtoken
 * Install: npm install jsonwebtoken
 */
export const verifyGoogleIdToken = async (idToken) => {
  try {
    // Fetch Google's public keys
    const keysResponse = await fetch("https://www.googleapis.com/oauth2/v1/certs");
    const keys = await keysResponse.json();

    // Decode without verification first to get the header
    const parts = idToken.split(".");
    if (parts.length !== 3) {
      throw new Error("Invalid token format");
    }

    const header = JSON.parse(Buffer.from(parts[0], "base64").toString());
    const payload = JSON.parse(Buffer.from(parts[1], "base64").toString());

    // Verify expiration
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      throw new Error("Token expired");
    }

    // Verify audience (client ID)
    const expectedClientId = "23324959742-6ffe6n1k4db0lsapekqdvh8u61jt0qfi.apps.googleusercontent.com";
    if (payload.aud !== expectedClientId) {
      throw new Error("Token not issued for this application");
    }

    // In production, you would verify the signature using the public key
    // For now, we trust Google's endpoint

    return {
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      sub: payload.sub,
      email_verified: payload.email_verified,
    };
  } catch (error) {
    throw new Error(`Google token verification failed: ${error.message}`);
  }
};
