export let currentCode: string;

/**
 *
 * Implement your own way of sharing the one time code used
 * to reset a password with the user, either through nodemailer
 * or twilio or whatever.
 *
 * In this example, the last-requested code is set to the exported
 * variable 'currentCode' to tbe used for testing
 */
export default function sendCode(_email: string, code: string) {
  currentCode = code;
  console.log('Received code', code);
  return Promise.resolve();
}
