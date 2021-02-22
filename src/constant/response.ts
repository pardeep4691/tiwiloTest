export const RESPONSES = {
  SUCCESS: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NOCONTENT: 204,
  BADREQUEST: 400,
  FORBIDDEN: 403,
  NOTFOUND: 404,
  TIMEOUT: 408,
  TOOMANYREQ: 429,
  INTERNALSERVER: 500,
  BADGATEWAYS: 502,
  SERVICEUNAVILABLE: 503,
  GATEWAYTIMEOUT: 504,
};

export const MIDDLEWARE_RESPONSE = {
  JWTERROR: "Unauthorize Request",
  WALLET_ZCH: process.env.WALLET_ZCH,
  WALLET_ETH: process.env.WALLET_ETH,
  TRADINGMAIN: process.env.TRADINGMAIN,
  WALLET_USD: process.env.WALLET_USD,
  PERMISSION_DENIED: "Permission has been denied for this user.",
};

export const RES_MSG = {
  ERROR: "Something went wrong",
  REGISTER: {
    SUCCESS: "Your account has been created successfully.",
  },
};
