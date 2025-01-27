import { Router} from "express";
import { deleteCookie, getCookieEndpoint, getCookieIdioma, getSignedCookie, loginWithCookie, setCookieEndpoint } from "../controllers/cookie.controller.js";

const cookieRouter = Router()

cookieRouter.get('/setCookie', setCookieEndpoint)

cookieRouter.get('/getCookie', getCookieEndpoint);

cookieRouter.get('/getCookieIdioma', getCookieIdioma)

cookieRouter.get('/setSignedCookie', )

cookieRouter.get('/getSignedCookie', getSignedCookie)

cookieRouter.post('/login', loginWithCookie);

cookieRouter.get('/deleteCookie', deleteCookie)

export default cookieRouter
