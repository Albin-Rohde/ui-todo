import { ValidationError } from "yup";
import { createParamDecorator } from "routing-controllers";
import { EntityNotFoundError } from "typeorm";

export const HandleErrors = (
  target: object,
  key: string | symbol,
  descriptor: PropertyDescriptor
) => {
  const originalMethod = descriptor.value;
  descriptor.value = async function (...args: unknown[]) {
    try {
      return await originalMethod.apply(this, args);
    } catch (err: unknown) {
      return returnErrorResponse(err as Error)
    }
  };
};

const returnErrorResponse = (err: unknown) => {
  if (err instanceof ValidationError) {
    return {
      ok: false,
      err: buildValidationError(err),
      data: null
    }
  }
  if (err instanceof EntityNotFoundError) {
    return {
      ok: false,
      err: { name: "NotFoundError", message: "resource could not be found" },
      data: null
    }
  }
  // make sure to not return unexpected errors to the client
  console.error(err);
  return {
    ok: false,
    err: { name: "INTERNAL_ERROR", message: "UNKNOWN_INTERNAL_ERROR" },
    data: null
  }
}

const buildValidationError = (err: ValidationError) => {
  const { message, path } = err;
  if (!path) {
    throw new Error("ValidationError must have a path");
  }
  return {
    name: "ValidationError",
    message,
    extra: { field: path, message }
  };
}

export function CurrentUser(options?: { required?: boolean }) {
  return createParamDecorator({
    required: options && options.required ? true : false,
    value: action => {
      return action.request.session.user
    },
  });
}