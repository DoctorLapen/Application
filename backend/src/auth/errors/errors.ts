export class UserAlreadyExistError extends Error {
    constructor() {
      super('user already exists with this email');
      this.name = "UserAlreadyExistError";
    }
  }

export class UserNotFoundError extends Error {
    constructor() {
      super("user not found");
      this.name = "UserNotFoundError";
    }
  }
  export class WrongPasswordError extends Error {
    constructor() {
      super('wrong password');
      this.name = "WrongPasswordError";
    }
  }