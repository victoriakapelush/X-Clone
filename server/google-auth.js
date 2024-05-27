const passport =require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: "345678472636-guk838eoghf55jeq1m0ul3iljtkrmocc.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:3000/google/callback",
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

app.get("/", (req, res) => {
    res.json({message: "You are not logged in"})
})

app.get("/failed", (req, res) => {
    res.send("Failed")
})
app.get("/success", (req, res) => {
    res.send(`Welcome ${req.user.email}`)
})

app.get('/google',
    passport.authenticate('google', {
            scope:
                ['email', 'profile']
        }
    ));

app.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/failed',
    }),
    function (req, res) {
        res.redirect('/success')

    }
);