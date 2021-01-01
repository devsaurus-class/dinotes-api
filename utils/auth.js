const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const passportJWT = require('passport-jwt');
const { ObjectId } = require('mongodb');

const { getDb } = require('./dbConnection');

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

passport.use(
  'register',
  new localStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email, password, done) => {
      try {
        const db = getDb();

        const existingUser = await db.collection('users').findOne({ username: email });

        if (!existingUser) {
          const encryptedPassword = await bcrypt.hash(password, 10);

          const data = {
            username: email,
            password: encryptedPassword,
            createdAt: new Date(Date.now()).toISOString(),
            updatedAt: new Date(Date.now()).toISOString()
          };

          const user = await db.collection('users').insertOne(data);

          return done(null, user);
        }

        return done(null, false, { message: 'User already registered' });
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(
  'login',
  new localStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email, password, done) => {
      try {
        const db = getDb();
        const user = await db.collection('users').findOne({ username: email });

        if (!user) {
          return done(null, false, { message: 'User not found' });
        }

        const validate = await bcrypt.compare(password, user.password);

        if (!validate) {
          return done(null, false, { message: 'Wrong Password' });
        }

        return done(null, user, { message: 'Logged in Successfully' });
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'mys3cret'
    },
    async (payload, done) => {
      try {
        const db = getDb();
        const user = await db.collection('users').findOne({ _id: ObjectId(payload._id) });

        if (!user) {
          return done(null, false);
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);
