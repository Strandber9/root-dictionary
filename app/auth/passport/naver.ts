import Express from "express";
import passport from "passport";
import { Strategy as NaverStrategy, Profile } from "passport-naver-v2";
import dotenv from "dotenv";
import { UserModel } from "../../model/models";
import JwtProvider from "../jwt/token.provider";

export const naverStrategy = new NaverStrategy(
    {
        clientID: process.env.NAVER_CLIENT_ID,
        clientSecret: process.env.NAVER_CLIENT_SCRET,
        callbackURL: process.env.NAVER_CALLBACK_URL,
    },
    async (accessToken: string, refreshToken: string, profile: Profile, done: Function) => {
        try {
            let user = await UserModel.findOne({
                // 네이버 플랫폼에서 로그인 했고 & snsId필드에 네이버 아이디가 일치할경우
                snsId: profile.id,
                providerType: "naver",
            });
            // 이미 가입된 네이버 프로필이면 성공
            if (!user) {
                // 가입되지 않는 유저면 회원가입 시키고 로그인을 시킨다
                user = await UserModel.create({
                    // email: profile._json.kakao_account_email && "None",
                    email: profile.email,
                    username: profile.nickname ?? profile.name,
                    snsId: profile.id,
                    providerType: "naver",
                    profile_image: profile.profileImage,
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
