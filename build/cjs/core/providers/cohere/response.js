"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
var response_exports = {};
__export(response_exports, {
  assessCohereResponse: () => assessCohereResponse
});
module.exports = __toCommonJS(response_exports);
var import_errors = require("../../errors");
function assessCohereResponse(response) {
  return __async(this, null, function* () {
    if (!response.ok) {
      const responseBody = yield response.json();
      const status = response.status;
      const message = responseBody.error.message || response.statusText;
      switch (status) {
        case 401:
          throw new import_errors.AuthorizationError(message);
        case 429: {
          if (response.statusText.includes("quota"))
            throw new import_errors.ServiceQuotaError(message);
          throw new import_errors.RateLimitError(message);
        }
        case 500:
          throw new import_errors.ServerError(message);
        default:
          if (status >= 400 && status < 500)
            throw new import_errors.ClientError(message);
          throw new Error(message);
      }
    }
    return true;
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  assessCohereResponse
});
