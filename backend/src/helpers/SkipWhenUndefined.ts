import { ValidationOptions, ValidateIf } from 'class-validator';
export const SkipWhenUndefined = (validationOptions?: ValidationOptions) => {
  return ValidateIf((_object, value) => value !== undefined, validationOptions);
};
