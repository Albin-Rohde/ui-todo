import { ValidationError } from "yup";
import { RestValidationError } from "./types";

export const handleErrors = (
  target: object,
  key: string | symbol,
  descriptor: PropertyDescriptor
) => {
  const originalMethod = descriptor.value;
  descriptor.value = async function (...args: unknown[]) {
    try {
      return await originalMethod.apply(this, args);
    } catch (err) {
      return returnErrorResponse(err as Error)
    }
  };
};

const returnErrorResponse = (err: Error) => {
  if (err instanceof ValidationError) {
    return {
      ok: false,
      err: buildValidationError(err),
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

const buildValidationError = (err: ValidationError): RestValidationError => {
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