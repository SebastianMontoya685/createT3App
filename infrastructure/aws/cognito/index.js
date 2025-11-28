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

// lambda-post-confirmation.ts
var lambda_post_confirmation_exports = {};
__export(lambda_post_confirmation_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(lambda_post_confirmation_exports);
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["query", "error"] : ["error"]
});
var handler = async (event) => {
  console.log("Cognito Post-Confirmation trigger received:", JSON.stringify(event, null, 2));
  try {
    const { sub: cognitoUserId, email, email_verified, name } = event.request.userAttributes;
    if (!cognitoUserId || !email) {
      console.error("Missing required attributes:", { cognitoUserId, email });
      return event;
    }
    const existingUser = await prisma.user.findUnique({
      where: { cognitoUserId }
    });
    if (existingUser) {
      console.log("User already exists:", cognitoUserId);
      return event;
    }
    const existingEmailUser = await prisma.user.findUnique({
      where: { email }
    });
    if (existingEmailUser) {
      await prisma.user.update({
        where: { email },
        data: {
          cognitoUserId,
          emailVerified: email_verified === "true" ? /* @__PURE__ */ new Date() : existingEmailUser.emailVerified
        }
      });
      console.log("Updated existing user with Cognito ID:", cognitoUserId);
      return event;
    }
    await prisma.user.create({
      data: {
        cognitoUserId,
        email,
        name: name || null,
        emailVerified: email_verified === "true" ? /* @__PURE__ */ new Date() : null
      }
    });
    console.log("Successfully created user:", cognitoUserId);
    return event;
  } catch (error) {
    console.error("Error in post-confirmation trigger:", error);
    return event;
  } finally {
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
