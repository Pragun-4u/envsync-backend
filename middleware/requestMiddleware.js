import joi from "joi";

const schema = joi.object({
  projectId: joi.string().required(),
  profileName: joi.string().required(),
  encryptedEnvData: joi.string().required(),
  initializationVector: joi.string().required(),
  salt: joi.string().required(),
  authTag: joi.string().required(),
});

export const pushMiddleware = (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    console.log(error);
    return res.status(400).json({ error: "Invalid request body" });
  }
  next();
};
