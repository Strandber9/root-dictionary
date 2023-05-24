import { UserModel } from "../../model/models";
import { User } from "../../entities/User";
import { Strategy as KakaoStrategy, Profile } from "passport-kakao";
import JwtProvider from "../jwt/token.provider";

export const kakaoStrategy = new KakaoStrategy(
    {
        clientID: process.env.KAKAO_CLIENT_ID!, // 카카오 로그인에서 발급받은 REST API 키
        callbackURL: process.env.KAKAO_CALLBACK_URL!, // 카카오 로그인 Redirect URI 경로
    },
    // clientID에 카카오 앱 아이디 추가
    // callbackURL: 카카오 로그인 후 카카오가 결과를 전송해줄 URL
    // accessToken, refreshToken : 로그인 성공 후 카카오가 보내준 토큰
    // profile: 카카오가 보내준 유저 정보. profile의 정보를 바탕으로 회원가입
    async (accessToken, refreshToken, profile: Profile, done) => {
        try {
            let user = await UserModel.findOne({
                // 카카오 플랫폼에서 로그인 했고 & snsId필드에 카카오 아이디가 일치할경우
                snsId: profile.id,
                providerType: "kakao",
            });
            // 이미 가입된 카카오 프로필이면 성공
            if (!user) {
                // 가입되지 않는 유저면 회원가입 시키고 로그인을 시킨다
                user = await UserModel.create({
                    // email: profile._json.kakao_account_email && "None",
                    email: `None`,
                    username: profile.displayName ?? profile.id,
                    snsId: profile.id,
                    providerType: "kakao",
                    profile_image: profile._json.kakao_account.profile.thumbnail_image_url,
                    profile_json: profile._json,
                });
            }

            user.token = JwtProvider.sign(user.id);
            user.save();

            done(null, user); // 회원가입하고 로그인 인증 완료
        } catch (error) {
            console.error(error);
            done(error);
        }
    }
);
