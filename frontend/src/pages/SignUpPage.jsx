import { useState } from "react";
import { ShipWheelIcon } from "lucide-react";
import { Link } from "react-router";
import useSignUp from "../hooks/useSignUp";

const SignUpPage = () => {
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  // validation state
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [passwordStrength, setPasswordStrength] = useState("Weak");

  const { isPending, error, signupMutation } = useSignUp();

  const validatePassword = (pwd) => {
    const errors = [];

    // Basic checks
    if (pwd.length < 8) {
      errors.push("Password must be at least 8 characters long.");
    }

    if (!/[a-z]/.test(pwd)) {
      errors.push("Password must include at least one lowercase letter.");
    }

    if (!/[A-Z]/.test(pwd)) {
      errors.push("Password must include at least one uppercase letter.");
    }

    if (!/[0-9]/.test(pwd)) {
      errors.push("Password must include at least one digit.");
    }

    if (!/[^A-Za-z0-9]/.test(pwd)) {
      errors.push("Password must include at least one special character (e.g. !@#$%).");
    }

    // Common / weak patterns to forbid
    const lower = pwd.toLowerCase();
    const commonPatterns = [
      "123456",
      "12345",
      "1234",
      "123",
      "password",
      "qwerty",
      "abcd",
      "abcdef",
      "111111",
      "letmein",
      "welcome",
      "admin",
    ];

    // check for sequential runs like 'abcd', 'abcd1234', or '12345'
    const hasSequential = (s) => {
      // detect sequences of length 4 or more
      const seqLen = 4;
      const sequences = [
        "abcdefghijklmnopqrstuvwxyz",
        "0123456789",
        "qwertyuiopasdfghjklzxcvbnm",
      ];
      for (const seq of sequences) {
        for (let i = 0; i <= seq.length - seqLen; i++) {
          const piece = seq.slice(i, i + seqLen);
          if (s.includes(piece)) return true;
        }
      }
      return false;
    };

    if (commonPatterns.some((p) => lower.includes(p))) {
      errors.push("Password contains a common pattern (e.g. '123456', 'password'). Choose something unique.");
    } else if (hasSequential(lower)) {
      errors.push("Password contains an obvious sequence (e.g. 'abcd' or '1234'). Avoid sequential characters.");
    }

    // Strength scoring
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++; // extra credit for longer passwords
    if (/[a-z]/.test(pwd)) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    let strength = "Weak";
    if (score >= 5) strength = "Strong";
    else if (score >= 3) strength = "Medium";
    else strength = "Weak";

    return { errors, strength, score };
  };

  const handlePasswordChange = (value) => {
    setSignupData({ ...signupData, password: value });
    const { errors, strength } = validatePassword(value);
    setPasswordErrors(errors);
    setPasswordStrength(strength);
  };

  const handleSignup = (e) => {
    e.preventDefault();
    // final validation
    const { errors } = validatePassword(signupData.password);
    setPasswordErrors(errors);
    if (errors.length > 0) return; // block submission while invalid
    signupMutation(signupData);
  };

  const isFormInvalid =
    !signupData.fullName.trim() ||
    !signupData.email.trim() ||
    !signupData.password ||
    passwordErrors.length > 0;

  return (
    <div
      className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8"
      data-theme="forest"
    >
      <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
        {/* SIGNUP FORM - LEFT SIDE */}
        <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">
          {/* LOGO */}
          <div className="mb-4 flex items-center justify-start gap-2">
            <ShipWheelIcon className="size-9 text-primary" />
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
              BEAM
            </span>
          </div>

          {/* ERROR MESSAGE IF ANY */}
          {error && (
            <div className="alert alert-error mb-4">
              <span>{error.response.data.message}</span>
            </div>
          )}

          <div className="w-full">
            <form onSubmit={handleSignup} autoComplete="off">
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold">Create an Account</h2>
                  <p className="text-sm opacity-70">
                    Join Beam and start your language learning adventure!
                  </p>
                </div>

                <div className="space-y-3">
                  {/* FULLNAME */}
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Full Name</span>
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="input input-bordered w-full"
                      value={signupData.fullName}
                      onChange={(e) =>
                        setSignupData({ ...signupData, fullName: e.target.value })
                      }
                      required
                      autoComplete="off"
                      spellCheck="false"
                      autoCorrect="off"
                      autoCapitalize="none"
                    />
                  </div>

                  {/* EMAIL */}
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Email</span>
                    </label>
                    <input
                      type="email"
                      placeholder="john@gmail.com"
                      className="input input-bordered w-full"
                      value={signupData.email}
                      onChange={(e) =>
                        setSignupData({ ...signupData, email: e.target.value })
                      }
                      required
                      autoComplete="off"
                      spellCheck="false"
                      autoCorrect="off"
                      autoCapitalize="none"
                    />
                  </div>

                  {/* PASSWORD with eye button 👁️ and strength/errors */}
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Password</span>
                    </label>

                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="********"
                        className="input input-bordered w-full pr-10"
                        value={signupData.password}
                        onChange={(e) => handlePasswordChange(e.target.value)}
                        required
                        autoComplete="new-password"
                        spellCheck="false"
                        autoCorrect="off"
                        autoCapitalize="none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-500 hover:text-primary"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <i className="ri-eye-off-line text-lg"></i>
                        ) : (
                          <i className="ri-eye-line text-lg"></i>
                        )}
                      </button>
                    </div>

                    {/* Strength badge */}
                    <div className="mt-2 flex items-center justify-start gap-3">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          passwordStrength === "Strong"
                            ? "text-green-800 bg-green-100"
                            : passwordStrength === "Medium"
                            ? "text-yellow-800 bg-yellow-100"
                            : "text-red-800 bg-red-100"
                        }`}
                      >
                        {passwordStrength}
                      </span>
                      <span className="text-xs opacity-70">
                        {signupData.password.length > 0 &&
                          `${signupData.password.length} characters`}
                      </span>
                    </div>

                    {/* Errors list */}
                    {passwordErrors.length > 0 && (
                      <ul className="mt-2 text-xs text-red-600 space-y-1">
                        {passwordErrors.map((err, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 flex-shrink-0 mt-0.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728"
                              />
                            </svg>
                            <span>{err}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Small helper */}
                    {passwordErrors.length === 0 && signupData.password.length > 0 && (
                      <p className="text-xs text-green-600 mt-2">Password looks good ✅</p>
                    )}
                  </div>

                  <div className="form-control">
                    <label className="label cursor-pointer justify-start gap-2">
                      <input type="checkbox" className="checkbox checkbox-sm" required />
                      <span className="text-xs leading-tight">
                        I agree to the{" "}
                        <span className="text-primary hover:underline">terms of service</span> and{" "}
                        <span className="text-primary hover:underline">privacy policy</span>
                      </span>
                    </label>
                  </div>
                </div>

                <button
                  className="btn btn-primary w-full"
                  type="submit"
                  disabled={isPending || isFormInvalid}
                >
                  {isPending ? (
                    <>
                      <span className="loading loading-spinner loading-xs"></span>
                      Loading...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>

                <div className="text-center mt-4">
                  <p className="text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary hover:underline">
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* SIGNUP FORM - RIGHT SIDE */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
          <div className="max-w-md p-8">
            {/* Illustration */}
            <div className="relative aspect-square max-w-sm mx-auto">
              <img src="/i.png" alt="Language connection illustration" className="w-full h-full" />
            </div>

            <div className="text-center space-y-3 mt-6">
              <h2 className="text-xl font-semibold">Connect with language partners worldwide</h2>
              <p className="opacity-70">
                Practice conversations, make friends, and improve your language skills together
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
