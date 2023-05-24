import { User } from "../entities/User";

export interface ApplicationContext {
    user?: User | null;
    token?: string;
}
