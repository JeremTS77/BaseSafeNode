import crypto from 'crypto-promise'

export const generateActive = crypto.randomBytes(8)

export const generateSalt = crypto.randomBytes(32)

export const generatePassword = (password, salt)=>{
	return crypto.pbkdf2(password, salt, 12000, 512, 'sha1')
}
