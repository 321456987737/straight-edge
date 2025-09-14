import CredentialsProvider from "next-auth/providers/credentials";
import { dbConnect } from "./db";
import customer from "@/model/customer";
import barber from "@/model/barber";
import bcrypt from "bcrypt";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        number: { label: "Phone Number", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await dbConnect();

        // 1. Try finding in customer collection
        let user = await customer.findOne({ number: credentials.number });
        let role = "customer";

        // 2. If not found in customer, try barber
        if (!user) {
          user = await barber.findOne({ number: credentials.number });
          role = "barber";
        }

        // 3. If user not found in either
        if (!user) {
          throw new Error("User not found");
        }

        // 4. Verify password
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Invalid password");
        }

        // 5. Return session user object
        return { id: user._id, role, number: user.number };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.number = user.number;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.number = token.number;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
  },

  pages: {
    signIn: "/signin",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// import CredentialsProvider from "next-auth/providers/credentials";
// import { dbConnect } from "./db";
// import customer from "@/model/customer";
// import barber from "@/model/barber";
// import bcrypt from "bcrypt";

// export const authOptions = {
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         number: { label: "Phone Number", type: "text" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         await dbConnect();
//         const Customer = await customer.findOne({ number: credentials.number });
//         if (!Customer) throw new Error("Customer not found");

//         const isValid = await bcrypt.compare(credentials.password, Customer.password);
//         if (!isValid) throw new Error("Invalid password");

//         return { id: Customer._id, role: Customer.role, number: Customer.number };
//       },
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.role = user.role;
//         token.number = user.number;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       if (token) {
//         session.user.role = token.role;
//         session.user.number = token.number;
//       }
//       return session;
//     },
//     async redirect({ url, baseUrl }) {
//       return baseUrl; // always redirect home unless overridden
//     },
//   },
//   pages: {
//     signIn: "/signin",
//   },
//   session: {
//     strategy: "jwt",
//   },
//   secret: process.env.NEXTAUTH_SECRET,
// };
