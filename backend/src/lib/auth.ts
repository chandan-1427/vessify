// root/src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { organization } from "better-auth/plugins";
// IMPORT the instance, don't create a new one
import { prisma } from "./prisma.js"; 

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    baseURL: process.env.BASE_URL_CLIENT, 
    secret: process.env.TOKEN_SECRET, 

    emailAndPassword: {
        enabled: true,
    },
    session: {
        strategy: "jwt", // This tells the core to use JWT
        expiresIn: 60 * 60 * 24 * 7, 
    },
    rateLimit: {
        enabled: true,
        window: 60,
        max: 100,
        customRules: {
            "/sign-in/email": { window: 10, max: 3 }, 
            "/sign-up/email": { window: 60, max: 3}
        }
    },
    plugins: [
        organization(),
    ],
    // ADD THIS BLOCK: It forces the token to include the JWT claims 
    // and ensures the activeOrganizationId is part of the signed payload.
    jwt: {
        enable: true, 
        definePayload: (data: { user: { id: string }; session: { activeOrganizationId?: string | null } }) => {
            return {
                userId: data.user.id,
                activeOrganizationId: data.session.activeOrganizationId,
            };
        },
    },
});