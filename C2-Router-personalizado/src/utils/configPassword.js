import bcrypt from 'bcrypt'

export const createHash = pswd => bcrypt.hashSync(pswd, bcrypt.genSaltSync(10)) //Encripta la pswd

export const isValidPassword = (pswd, user) => bcrypt.compareSync(pswd, user.password);  // Verifica la contraseña

