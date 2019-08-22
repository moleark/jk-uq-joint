import * as crypto from 'crypto';
import * as bcrypt from 'bcryptjs';

const saltRounds = 10;
export async function hashPassword(pwd: string): Promise<string> {
    let salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(pwd, salt);
}

export async function comparePassword(pwd: string, auth: string) {
    return await bcrypt.compare(pwd, auth) == true;
}


const algorithm = 'aes-128-cbc';
const cryptoPassword = 'pickering-on-ca';

export function encrypt(pwd: string): string {
    const mykey = crypto.createCipher(algorithm, cryptoPassword);
    let cryptedPwd: string = mykey.update(pwd, 'utf8', 'hex');
    cryptedPwd += mykey.final('hex');
    return cryptedPwd;
}

export function decrypt(cryptedPwd: string): string {
    const mykeyD = crypto.createDecipher(algorithm, cryptoPassword);
    let str = mykeyD.update(cryptedPwd, 'hex', 'utf8');
    str = mykeyD.final('utf8');
    return str;
}
