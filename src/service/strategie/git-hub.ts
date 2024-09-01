import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import dotenv from 'dotenv';
import db from '@/utils/db';

dotenv.config();

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID ?? '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? '',
      callbackURL: 'http://localhost:8080/api/v1/auth/github/callback',
    },
    async (accessToken: string, refreshToken: string, profile: any, done: (err: any, user?: any) => void) => {
      try {
        // Log profile and tokens to debug
        console.log('GitHub Profile:', profile);
        console.log('Access Token:', accessToken);
        console.log('Refresh Token:', refreshToken);

        const { login, avatar_url } = profile._json;
        const id = profile.id.toString();

        let user = await db.user.findUnique({
          where: { providerId: id as string },
        });

        if (!user) {
          user = await db.user.create({
            data: {
              username: login,
              profileImage: avatar_url,
              providerId: id,
              accounts: {
                create: {
                  provider: 'github',
                  providerAccountId: id,
                  accessToken,
                  refreshToken,
                },
              },
            },
          });
        } else {
          let account = await db.account.findUnique({
            where: {
              provider_providerAccountId: {
                provider: 'github',
                providerAccountId: id,
              },
            },
          });

          if (!account) {
            await db.account.create({
              data: {
                userId: user.id,
                provider: 'github',
                providerAccountId: id,
                accessToken,
                refreshToken,
              },
            });
          }
        }

        return done(null, user);
      } catch (err) {
        console.error('Error in GitHub strategy:', err);
        return done(err);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
    console.log('Serializing user:', user);
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await db.user.findUnique({
        where: { id },
        include: {
          accounts: true,
          sessions: true,
        },
      });
      done(null, user);
    } catch (err) {
      console.error('Error deserializing user:', err);
      done(err, null);
    }
  });
  