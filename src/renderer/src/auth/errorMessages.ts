export function friendlyAuthError(
  err: { code: string; message: string } | unknown,
): string {
  if (
    err &&
    typeof err === "object" &&
    "code" in err &&
    typeof err.code === "string" &&
    "message" in err &&
    typeof err.message === "string"
  ) {
    switch (err.code) {
      case "auth/weak-password":
        return "Password is too weak.";
      case "auth/network-request-failed":
        return "Network request failed.";
      case "auth/too-many-requests":
        return "Too many requests. Please try again later.";
      case "auth/user-not-found":
        return "No account found with that email.";
      case "auth/wrong-password":
        return "Incorrect password.";
      case "auth/email-already-in-use":
        return "An account with that email already exists.";
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/invalid-credential":
        return "Email or password is incorrect.";
      default:
        return err.message;
    }
  }
  return String(err);
}
