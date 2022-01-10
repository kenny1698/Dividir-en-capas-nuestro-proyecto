import { Router } from 'express'
import passport from 'passport'
import passportLocal from 'passport-local'
import User from '../../models/User.js'
import mongoose from 'mongoose'
import session from 'express-session'
import logger  from '../../log4js/log4js-module.js'
import {
    createHash,
    isValidPassword
  } from './middleware/utils.js'

import flash from 'connect-flash'
import dotenv from 'dotenv'
dotenv.config({ path: "./src/.env"})

const LocalStrategy = passportLocal.Strategy;
const secretMongo = process.env.secretMongo
const routerDatos = new Router()
const mongoDB = process.env.mongoDB
mongoose.connect(mongoDB)
routerDatos.use(session(
  { secret: secretMongo , 
                        resave: false, 
                        saveUninitialized:false, 
                        cookie: { maxAge: 600000 }
})
)
routerDatos.use(passport.initialize())
routerDatos.use(passport.session())
routerDatos.use(flash())


passport.use('login', new LocalStrategy(
    (username, password, done) => {
      return User.findOne({ username })
        .then(user => {
          if (!user) {
            return done(null, false, { message: 'Usuario de usuario incorrecto' })
          }
  
          if (!isValidPassword(user.password, password)) {
            return done(null, false, { message: 'Contraseña incorrecta' })
          }
  
          return done(null, user)
        })
        .catch(err => {
          return done(err)
        })
    }
  ))
  
  passport.serializeUser((user, done) => {
    done(null, user)
  })
  
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user)
    })
  })
  
  passport.use('register', new LocalStrategy({
    passReqToCallback: true
  }, (req, username, password, done) => {
    return User.findOne({ username })
      .then(user => {
        if (user) {
          return done(null, false, { message: 'El usuario de usuario ya existe' })
        }
  
        let newUser = new User()
        newUser.password = createHash(password)
        newUser.username = req.body.username
        return newUser.save()
      })
      .then(user => {
        return done(null, user)
      })
      .catch(err => {
        return done(err)
      })
  }))
  
  routerDatos.get('/login', (req, res) => {
    return res.render('login')
  })

  routerDatos.get('/faillogin', (req, res) => {
    return res.render('faillogin', { message: req.flash('error') })
  })

  routerDatos.get('/failregister', (req, res) => {
    return res.render('failregister', { message: req.flash('error') })
  })
  
  routerDatos.post('/login', 
    passport.authenticate('login', { successRedirect: '/',
                                     failureRedirect: '/faillogin',
                                     failureFlash: true }))
  
  routerDatos.get('/register', (req, res) => {
    return res.render('register')
  })
  
  routerDatos.post('/register', 
    passport.authenticate('register', { successRedirect: '/',
                                     failureRedirect: '/failregister',
                                     failureFlash: true }))
  
  
routerDatos.get('/', (req, res, next) => {
    if (req.isAuthenticated()) {
      return next()
    }
    
    return res.redirect('/login')
  }, (req, res) => {
    const nombreSesion = req.user.username
    req.session.username = nombreSesion
    return res.render('index', {nombreSesion})
  })

routerDatos.post('/logout', (req, res) => {
    const nombreSesion = req.user.username
    req.session.destroy(err => {
        if (!err) 
        res.render('logout', {nombreSesion}) 
        else res.send({ status: 'Logout ERROR', body: err })
    })
    console.log(req.session)
})


export default routerDatos