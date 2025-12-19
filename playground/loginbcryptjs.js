const bcryptjs = require('bcryptjs');

async function UserLogin(password) {
    const hash = '$2b$10$Ci/02iVGjj.dmOZrSIhGXef2KHjiSmHbQNIoeAkTYRzkTrrrDks9C';
    const extractSalt = hash.slice(0,29);
    console.log('extractSalt', extractSalt);
    const newhash = await bcryptjs.hash(password, extractSalt);
    console.log('newhash', newhash);
    console.log(hash === newhash);
}
UserLogin('secret123');
