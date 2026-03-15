import { Link, useNavigate, useSearchParams } from "react-router";
import PasswordInput from "../../components/PasswordInput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginValidator } from "../../validation/loginValidator";
import type { LoginRequest } from "./types";
import { loginUser } from "./authThunks";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store/store";
import { useState } from "react";


const LoginForm = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [serverError, setServerError] = useState<string | null>(null);
  const navigate = useNavigate()
  const [searchParams] = useSearchParams();
  const from = searchParams.get("from") || "/";

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields, isValid, isSubmitting },
    watch
  } = useForm<LoginRequest>({
    resolver: yupResolver(loginValidator),
    mode: "onChange",
  });
  watch(() => {
  if (serverError) setServerError(null)
})

  const onSubmit = async (data: LoginRequest) => {
    try {
      setServerError(null);
      await dispatch(loginUser(data)).unwrap()
       navigate(from, { replace: true });
      
    } catch (error: unknown) {
      
      if (typeof error === "string") {
        setServerError(error);
      } else if (error instanceof Error) {
        setServerError(error.message || "failed to authenticate");
      } else {
        setServerError("failed to authenticate");
      }
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-300"
    >
      <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>
      <input
        type="email"
        placeholder="Email"
        {...register("email")}
        className="w-full p-3 mb-1 border rounded focus:outline-none focus-within:ring-2 focus-within:ring-blue-500"
      />
      <p className="text-red-500 text-sm h-5 flex items-center transition-all duration-200">
        {touchedFields.email && errors.email
          ? errors.email.message
          : " "}
      </p>
      <PasswordInput
        placeholder="Password"
        {...register("password")}
        className="w-full p-3 mb-1 border rounded focus-within:ring-2 focus-within:ring-blue-500"
      />
      <p className="text-red-500 text-sm h-7 flex items-center transition-all duration-200 mb-2">
        {touchedFields.password && errors.password
    ? errors.password.message
    : serverError || " "}
      </p>
      <button
        type="submit"
        disabled={!isValid || isSubmitting}
        className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition disabled:bg-gray-400
    disabled:opacity-70
    disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Loading..." : "Sign in"}
      </button>
      <p className="mt-4 text-center text-gray-600">
        Don’t have an account?{" "}
        <Link to={`/register?from=${encodeURIComponent(from)}`} className="text-blue-500 hover:underline">
          Register
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;