const bcryptjs = require('bcryptjs');

async function registerUser(password) {
    const salt = await bcryptjs.genSalt();
    console.log('salt', salt, salt.length);
    const hash = await bcryptjs.hash(password, salt);
    console.log('hash', hash, hash.length);
}
registerUser('secret1234');
