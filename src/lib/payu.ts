import crypto from "crypto";

export interface PayUHashParams {
  key: string;
  txnid: string;
  amount: string;
  productinfo: string;
  firstname: string;
  email: string;
  udf1?: string;
  udf2?: string;
  udf3?: string;
  udf4?: string;
  udf5?: string;
}

/**
 * Generate SHA512 hash for PayU request:
 * sha512(key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||SALT)
 */
export function generatePayURequestHash(
  params: PayUHashParams,
  salt: string
): string {
  const hashString = [
    params.key,
    params.txnid,
    params.amount,
    params.productinfo,
    params.firstname,
    params.email,
    params.udf1 || "",
    params.udf2 || "",
    params.udf3 || "",
    params.udf4 || "",
    params.udf5 || "",
    "", // udf6
    "", // udf7
    "", // udf8
    "", // udf9
    "", // udf10
    salt,
  ].join("|");

  return crypto.createHash("sha512").update(hashString).digest("hex");
}

/**
 * Verify SHA512 response hash from PayU callback:
 * sha512(SALT|status||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key)
 * Additional check: if additionalCharges is returned:
 * sha512(additionalCharges|SALT|status||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key)
 */
export function verifyPayUResponseHash(
  resParams: Record<string, any>,
  salt: string
): boolean {
  const status = resParams.status || "";
  const txnid = resParams.txnid || "";
  const amount = resParams.amount || "";
  const productinfo = resParams.productinfo || "";
  const firstname = resParams.firstname || "";
  const email = resParams.email || "";
  const key = resParams.key || "";
  const udf1 = resParams.udf1 || "";
  const udf2 = resParams.udf2 || "";
  const udf3 = resParams.udf3 || "";
  const udf4 = resParams.udf4 || "";
  const udf5 = resParams.udf5 || "";
  const additionalCharges = resParams.additionalCharges;
  const receivedHash = resParams.hash || "";

  let hashSequence = [
    salt,
    status,
    "", // udf10
    "", // udf9
    "", // udf8
    "", // udf7
    "", // udf6
    udf5,
    udf4,
    udf3,
    udf2,
    udf1,
    email,
    firstname,
    productinfo,
    amount,
    txnid,
    key,
  ].join("|");

  if (additionalCharges) {
    hashSequence = `${additionalCharges}|${hashSequence}`;
  }

  const calculatedHash = crypto
    .createHash("sha512")
    .update(hashSequence)
    .digest("hex");

  return calculatedHash.toLowerCase() === receivedHash.toLowerCase();
}
