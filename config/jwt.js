function verifyToken(req, res, next) {
  const apiHeader = req.headers['authorization'];

  if(typeof apiHeader !== 'undefined') {
    const api = apiHeader.split(' ');
    const apiToken = api[1]; //get Token from array
    req.token = apiToken;
    console.log(apiToken);
    next();
  }
  else
  {
    res.send({"status" : 421, "message":"forbidden"})
  }
}

module.exports = verifyToken
