import { createAuthClient } from "better-auth/react"; 
import { deviceAuthorizationClient } from "better-auth/client/plugins";
export const authClient = createAuthClient({
    baseURL: "http://localhost:3010/api/auth",  
    plugins:[deviceAuthorizationClient()]
    });