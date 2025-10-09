import { Response } from "express";

export function setAuthCookie(
  res: Response,
  name: string,
  value: string,
  maxAge: number
) {
  res.cookie(name, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge,
  });
}

export function setRefreshTokenCookie(res: Response, refreshToken: string) {
  setAuthCookie(res, "refreshToken", refreshToken, 7 * 24 * 60 * 60 * 1000);
}

export function clearRefreshTokenCookie(res: Response) {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
}
