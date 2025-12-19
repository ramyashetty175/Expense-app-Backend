const jwt = require('jsonwebtoken');

//decode token
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJyYW15YUAxMjNnbWFpbC5jb20iLCJpYXQiOjE3NTI0MDAwMTcsImV4cCI6MTc1MzAwNDgxN30.f4cmBGPijRRB_o86m4elfmdJPKTzE_asMxHAno_xugQ';
try {
   const tokenData = jwt.verify(token, 'dct123');
   console.log(tokenData);
}catch(err) {
   console.log(err.message);
}
