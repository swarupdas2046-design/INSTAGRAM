import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { Flip, toast, Zoom } from "react-toastify";
import { useAuth } from "../hooks/userAuth";
const Register = () => {
  const navigate = useNavigate();
  const { loading, userRegister } = useAuth();
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });
  const FormSubmit = async (data) => {
    const { username, email, password } = data;
    const response = await userRegister(username, email, password);

    console.log(response);
    navigate("/app")
  };

  if (loading) {
    return <h1>Loading....</h1>
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 font-sans relative overflow-hidden text-zinc-300">
      {/* Soft Ambient Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-900/20 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Register Card */}
      <div className="w-full max-w-md bg-[#121212]/80 backdrop-blur-xl rounded-3xl border border-zinc-800 shadow-2xl p-8 sm:p-10 relative z-10 my-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Create an account
          </h2>
          <p className="text-sm text-zinc-500 mt-2">
            Join us today. It only takes a few steps.
          </p>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit(FormSubmit)}>
          {/* Full Name Input */}
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-zinc-400">
              Full Name
            </label>
            <input
              {...register("username", { required: "Name is Required" })}
              type="text"
              id="name"
              placeholder="e.g. Swarup Das"
              className="w-full bg-[#1a1a1a] border border-zinc-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-zinc-600"
            />
            {errors.name && (
              <p className="text-xs italic font-medium text-red-500">
                {errors.name?.message}
              </p>
            )}
          </div>

          {/* Email Input */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-zinc-400"
            >
              Email address
            </label>
            <input
              {...register("email", { required: "Email is Required" })}
              type="email"
              id="email"
              placeholder="name@example.com"
              className="w-full bg-[#1a1a1a] border border-zinc-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-zinc-600"
            />
            {errors.email && (
              <p className="text-xs italic font-medium text-red-500">
                {errors.email?.message}
              </p>
            )}
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-zinc-400"
            >
              Password
            </label>
            <input
              {...register("password", {
                required: "Password is Required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              type="password"
              id="password"
              placeholder="Create a strong password"
              className="w-full bg-[#1a1a1a] border border-zinc-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-zinc-600"
            />
            {errors.password && (
              <p className="text-xs italic font-medium text-red-500">
                {errors.password?.message}
              </p>
            )}
          </div>

          {/* Terms & Conditions Checkbox */}
          <div className="flex items-start gap-3 pt-2">
            <div className="flex items-center h-5">
              <input
                type="checkbox"
                id="terms"
                className="w-4 h-4 rounded bg-[#1a1a1a] border-zinc-800 text-emerald-500 focus:ring-emerald-500/50 focus:ring-offset-0 cursor-pointer accent-emerald-600 mt-0.5"
              />
            </div>
            <label
              htmlFor="terms"
              className="text-sm text-zinc-400 cursor-pointer leading-tight"
            >
              I agree to the{" "}
              <a
                href="#"
                className="font-semibold text-emerald-500 hover:text-emerald-400 transition-colors"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="font-semibold text-emerald-500 hover:text-emerald-400 transition-colors"
              >
                Privacy Policy
              </a>
              .
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-emerald-900/20 mt-2"
          >
            Create Account
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-8">
          <div className="h-px flex-1 bg-zinc-800/50"></div>
          <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
            Or register with
          </span>
          <div className="h-px flex-1 bg-zinc-800/50"></div>
        </div>

        {/* Social Registration */}
        <div className="flex gap-4">
          <button className="flex-1 flex items-center justify-center gap-2 bg-[#1a1a1a] hover:bg-zinc-800 border border-zinc-800 text-white py-3 rounded-xl transition-colors font-medium text-sm">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
            </svg>
            Google
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 bg-[#1a1a1a] hover:bg-zinc-800 border border-zinc-800 text-white py-3 rounded-xl transition-colors font-medium text-sm">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                clipRule="evenodd"
              />
            </svg>
            GitHub
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-zinc-500 mt-8">
          Already have an account?{" "}
          <span
            onClick={() => {
              navigate("/");
            }}
            className="font-semibold text-white hover:text-emerald-400 transition-colors"
          >
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
