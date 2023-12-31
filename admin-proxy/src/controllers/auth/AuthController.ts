import { Request, Response, NextFunction } from "express";
import { authenticationService } from "../../services/Auth";

export class AuthController {
  private static instance: AuthController;

  private constructor() {}

  public static getInstance(): AuthController {
    if (!AuthController.instance) {
      AuthController.instance = new AuthController();
    }
    return AuthController.instance;
  }

  public async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.user!;
      if (process.env.NODE_ENV !== 'production') console.log("Logout ID", id);
      if (process.env.NODE_ENV !== 'production') console.log("logout", authenticationService === undefined);
      const result = await authenticationService.logout(id);
      // Clear cookies from client
      res.clearCookie("jwt");
      res.json({ success: result });
    } catch (error) {
      next(error);
    }
  }

  public async authCallback(req: Request, res: Response, next: NextFunction) {
    try {
      const redirectUrl = process.env.CLIENT_AUTH_REDIRECT_URL || '/auth/me';
      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", req.user!.token, { 
          httpOnly: true,
        });
      } else {
        res.cookie("jwt", req.user!.token, { 
          httpOnly: true,
          secure: true,
          sameSite: "none",
        });
      }
      res.redirect(redirectUrl);
    } catch (error) {
      next(error);
    }
  }

  public async magicToken(req: Request, res: Response, next: NextFunction) {
    try {
      if (process.env.NODE_ENV !== 'production') console.log(req.body);
      const { roleLs } = req.body;
      const user = await authenticationService.generateTemporaryToken(roleLs);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }
}
