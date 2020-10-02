export interface UserTokenPayload {
  email: string;
}

export class UserToken {
  token: string;

  constructor(token: string) {
    this.token = token;
  }

  decode = () => {
    const payload = jwt.verify(this.token, process.env.SECRET_KEY);
    // need to make sure the decodedToken fits the UserTokenPayload interface
    if (!DecodedUserToken.isUserTokenPayload(payload)) {
      throw new Error(
        "Could not decode Token: Decoded payload is not a user payload",
      );
    }
    return new DecodedUserToken(payload);
  };
}

export class DecodedUserToken {
  payload: UserTokenPayload;

  constructor(payload: UserTokenPayload) {
    this.payload = payload;
  }

  encode = () => {
    const token = jwt.sign(this.payload, process.env.SECRET_KEY);
    return new UserToken(token);
  };

  static isUserTokenPayload = (input: any): input is UserTokenPayload => {
    const keys = Object.keys(input);
    return (
      keys.length === 1
      && keys[0] === "email"
      && typeof input.email === "string"
    );
  };
}
