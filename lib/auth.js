import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db("biblio_drop");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),

  emailAndPassword: {
    enabled: true,
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user",
        /*
         * `input: false` keeps `role` out of the schema Better Auth accepts from
         * the client, so `role` in a sign-up payload is stripped and every new
         * account falls back to `defaultValue`.
         *
         * Without this, `authClient.signUp.email({ role })` is honoured and any
         * visitor can mint themselves a librarian (and therefore reach
         * `requireRole("librarian")` routes such as POST /books and
         * PATCH /deliveries/:id/status). Promotion is an admin-only operation,
         * performed server-side by PATCH /admin/users/:id/role.
         */
        input: false,
      },
    },
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  trustedOrigins: ["http://localhost:3000", process.env.FRONTEND_URL],

  plugins: [jwt()],
  session: {
    cookieCache: {
      enabled: true,
      strategy: "jwt",
      maxAge: 7 * 24 * 60 * 60,
    },
  },
});
