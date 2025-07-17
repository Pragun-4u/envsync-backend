import joi from "joi";

const pushSchema = joi.object({
  projectId: joi.string().required(),
  profileName: joi.string().required(),
  encryptedEnvData: joi.string().required(),
  initializationVector: joi.string().required(),
  salt: joi.string().required(),
  authTag: joi.string().required(),
});

const pullSchema = joi.object({
  projectId: joi.string().required(),
  profileName: joi.string().required(),
});

export const pushMiddleware = (req, res, next) => {
  const { error } = pushSchema.validate(req.body);
  if (error) {
    console.log(error);
    return res.status(400).json({ error: "Invalid request body" });
  }
  next();
};

export const pullMiddleware = (req, res, next) => {
  const { error } = pullSchema.validate(req.body);
  if (error) {
    console.log(error);
    return res.status(400).json({ error: "Invalid request body" });
  }
  next();
};
