import Joi, { Schema, ObjectPropertiesSchema } from 'joi';
import httpStatus from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';
import pick from '@/utils/pick';

const validate = (schema: Schema | ObjectPropertiesSchema) => (req: Request, res: Response, next: NextFunction) => {
  const validSchema = pick(schema, ['params', 'query', 'body']);
  const object = pick(req, Object.keys(validSchema));
  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: 'key' }, abortEarly: false })
    .validate(object);

  if (error) {
    const errorMessage = error.details.map((details) => details.message).join(', ');
    res.status(httpStatus.BAD_REQUEST).json({
      status: false,
      message: errorMessage
    })
    return next();
  }
  Object.assign(req, value);
  return next();
};

export default validate;
