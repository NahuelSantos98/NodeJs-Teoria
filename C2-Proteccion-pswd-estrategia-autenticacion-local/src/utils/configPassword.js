import bcrypt from 'bcrypt'

export const createHash = pswd => bcrypt.hashSync(pswd, bcrypt.genSaltSync(10)) //Encripta la pswd

export const isValidPassword = (user, pswd) => bcrypt.compareSync(pswd, user.password) //Verifica la pswd (Desencripta y verifica)

