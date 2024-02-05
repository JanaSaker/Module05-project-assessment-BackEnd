import jwt from "jsonwebtoken";

export async function verifyToken(req, res, next) {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  let token_split = token.split(" ");
  console.log(token_split);

  jwt.verify(token_split[1], process.env.SECRET_STRING, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Failed to authenticate token" });
    }
    req.userId = decoded.id;
    req.role = decoded.role;
    next();
  });
}
export async function verifyadmin(req, res, next) {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  let token_split = token.split(" ");
  console.log(token_split);
  jwt.verify(token_split[1], process.env.SECRET_STRING, (err, decoded) => {
    req.role = decoded.role;

    if (err || req.role.toLowerCase() != "admin" ) {
      return res.status(403).json({ message: "Failed to authenticate token" });
    }
    req.userId = decoded.id;

    next();
  });
}

