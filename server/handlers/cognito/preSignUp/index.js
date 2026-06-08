exports.handler = async (event) => {
  // Auto-confirm the user — no verification email required
  event.response.autoConfirmUser = true;

  // Auto-verify the email attribute so it counts as verified immediately
  if (event.request.userAttributes?.email) {
    event.response.autoVerifyEmail = true;
  }

  return event;
};
