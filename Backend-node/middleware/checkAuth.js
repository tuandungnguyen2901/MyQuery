const jwt = require('jsonwebtoken');

exports.checkAuth = (req, res, next) => {
  try {
    const token = req?.headers?.authorization?.split(' ')[1];

    const isCustomAuth = token?.length < 500;
    let decodedData;
    if (token && isCustomAuth) {
      decodedData = jwt.verify(token, process.env.SECRET_KEY);
      req.userId = decodedData?.user_id || decodedData?.sub;
    } else {
      decodedData = jwt.decode(token);
      req.userId = decodedData?.sub;
    }
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ msg: error.message || 'Something went wrong' });
  }
};
