import Express from "express";
import passport from "passport";
import dotenv from "dotenv";
import { kakaoStrategy } from "../../auth/passport/kakao";
import { User } from "../../entities/User";

dotenv.config();
const router = Express.Router();

/* URL: /login/naver
-------------------------------------------------------------------------------- */
router.get("/kakao", passport.authenticate("kakao"));

/* 위에서 카카오 서버 로그인이 되면, 네이버 redirect url 설정에 따라 이쪽 라우터로 오게 된다.
-------------------------------------------------------------------------------- */
const callbackUrl = process.env.KAKAO_CALLBACK_URL?.replace("/auth", "") ?? "/kakao/callback";
router.get(
    callbackUrl,
    //? 그리고 passport 로그인 전략에 의해 naverStrategy로 가서 카카오계정 정보와 DB를 비교해서 회원가입시키거나 로그인 처리하게 한다.
    passport.authenticate("kakao", { failureRedirect: "/login", session: false }),
    (req, res) => {
        const user: Partial<User> = req.user ?? {};
        res.cookie("jwtToken", user.token, { maxAge: 3600000, httpOnly: true });
        res.redirect("/");
    }
);

passport.use(kakaoStrategy);

export default router;
