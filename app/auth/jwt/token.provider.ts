import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const token = jwt.sign({ email: "test@user.com" }, "our_secret");
console.log(token);

export default class JwtProvider {
    /**
     *
     * @param email
     * @param privateKey
     * @returns
     */
    static sign(payload: any, opt: jwt.SignOptions = { expiresIn: "1y" }) {
        const token = jwt.sign({ data: payload }, process.env.JWT_PRIVATE_KEY!, opt);
        return token;
    }

    /**
     *
     * @param token
     * @param privateKey
     */
    static verify(token: string) {
        return jwt.verify(token, process.env.JWT_PRIVATE_KEY!);
    }

    static decode(token: string, options?: jwt.DecodeOptions) {
        return jwt.decode(token);
    }
}
