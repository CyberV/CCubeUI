import crypto from 'crypto-js';
let AES = crypto.AES;
let HASH = crypto.HmacSHA256;

let secretKey = "ashdj33cdga47ewHefhJfdd46498Hdgffieyrewie";  // Random generated

export function encrypt(plainText) {
    return AES.encrypt(plainText, secretKey).toString();
};

export function decrypt(encrypted) {
    return AES.decrypt(encrypted, secretKey).toString(crypto.enc.Utf8);
};

export function hash(text, secret=secretKey) {
    return HASH(text, secret).toString();
};


