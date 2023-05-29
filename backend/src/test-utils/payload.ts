import { faker } from "@faker-js/faker";

export const generateCreatePayload = () => {
  const password = faker.internet.password();
  return {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: password,
    passwordConfirmation: password,
  }
};

export const generateSignInPayload = () => ({
  email: faker.internet.email(),
  password: faker.internet.password(),
})