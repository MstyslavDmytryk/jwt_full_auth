import jwt from 'jsonwebtoken';
import tokenModel from '../models/token-model.js';

function generateTokens(payload) {
  const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '30s' });
  return {
    accessToken,
    refreshToken
  };
}

function validateAccessToken(token) {
  try {
    const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    return userData;
  } catch (e) {
    console.error('Error during token verification:', e);
    return null;
  }
}

function validateRefreshToken(token) {
  try {
    const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    return userData;
  } catch (e) {
    return null;
  }
}

async function saveToken(userId, refreshToken) {
  const tokenData = await tokenModel.findOne({ user: userId });
  if (tokenData) {
    tokenData.refreshToken = refreshToken;
    return tokenData.save();
  }
  const token = await tokenModel.create({ user: userId, refreshToken });
  return token;
}

async function removeToken(refreshToken) {
  const tokenData = await tokenModel.deleteOne({ refreshToken });
  return tokenData;
}

async function findToken(refreshToken) {
  const tokenData = await tokenModel.findOne({ refreshToken });
  return tokenData;
}

export default {
  generateTokens,
  validateAccessToken,
  validateRefreshToken,
  saveToken,
  removeToken,
  findToken,
};
