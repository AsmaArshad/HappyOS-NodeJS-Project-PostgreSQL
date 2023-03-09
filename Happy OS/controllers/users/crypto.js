// crypto module
const crypto = require("crypto");
const algorithm = "aes-256-cbc"; 
const Securitykey = crypto.randomBytes(32);
// generate 16 bytes of random data
const initVector = crypto.randomBytes(16);

// protected data
const encrypt = (text) => {

// secret key generate 32 bytes of random data
// the cipher function
const cipher = crypto.createCipheriv(algorithm, Securitykey, initVector);
let encryptedData = cipher.update(text, "utf-8", "hex");
 encryptedData += cipher.final("hex");
  return encryptedData;
}

const decrypt = (encryptedData) => {
    // the decipher function
    try{
const decipher = crypto.createDecipheriv(algorithm, Securitykey, initVector);
let decryptedData = decipher.update(encryptedData, "hex", "utf-8");
decryptedData += decipher.final("utf8");
return decryptedData;
    }
    catch(err){ }
}

module.exports= {encrypt, decrypt}