import ApiError from '../exceptions/api-error.js';
import tokenService from '../service/token-service.js';

export default async function authenticateMiddleware(req, res, next) {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      return next(ApiError.UnauthorizedError());
    }

    const accessToken = authorizationHeader.split(' ')[1];
    if (!accessToken) {
      return next(ApiError.UnauthorizedError());
    }

    console.log('Access Token:', accessToken);

    const userData = await tokenService.validateAccessToken(accessToken);
    console.log('Decoded User Data:', userData);



    if (!userData) {
      return next(ApiError.UnauthorizedError());
    }

    req.user = userData;
    next();
  } catch (e) {
    console.error('Error during authentication:', e);
    return next(ApiError.UnauthorizedError());
  }
}
