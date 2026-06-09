function validateEmail(email) {
  if (!email || !email.includes("@")) {
    throw new Error("Email must contain @ symbol");
  }
}

module.exports = { validateEmail };
