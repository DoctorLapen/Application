import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import PasswordInput from "../../components/PasswordInput";
import { Link, useNavigate, useSearchParams } from "react-router";
import { registerValidator } from "../../validation/registerValidator";
import type { LoginRequest, RegisterRequest } from "./types";
import { loginUser, registerUser } from "./authThunks";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store/store";
import { useState } from "react";




const RegisterForm = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields, isValid, isSubmitting },
    watch
  } = useForm<RegisterRequest>({
    resolver: yupResolver(registerValidator),
    mode: "onChange",
  });
  watch(() => {
    if (serverError) setServerError(null)
  })
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams();
  const from = searchParams.get("from") || "/";

  const onSubmit = async (data: RegisterRequest) => {
    try {
      setServerError(null);
      await dispatch(registerUser(data)).unwrap()

      const loginData: LoginRequest = {
        email: data.email,
        password: data.password,
      }
      await dispatch(loginUser(loginData)).unwrap()

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
      <h2 className="text-3xl font-bold mb-6 text-center">Register</h2>

      <input
        type="text"
        placeholder="First Name"
        {...register("firstName")}
        className="w-full p-3 mb-1 border rounded focus:outline-none focus-within:ring-2 focus-within:ring-blue-500"
      />
      <p className="text-red-500 text-sm h-5 flex items-center transition-all duration-200">
        {touchedFields.firstName && errors.firstName
          ? errors.firstName.message
          : " "}
      </p>

      <input
        type="text"
        placeholder="Last Name"
        {...register("lastName")}
        className="w-full p-3 mb-1 border rounded focus:outline-none focus-within:ring-2 focus-within:ring-blue-500"
      />

      <p className="text-red-500 text-sm h-5  flex items-center transition-all duration-200">
        {touchedFields.lastName && errors.lastName
          ? errors.lastName.message
          : " "}
      </p>

      <input
        type="email"
        placeholder="Email"
        {...register("email")}
        className="w-full p-3 mb-1 border rounded focus:outline-none focus-within:ring-2 focus-within:ring-blue-500 "
      />
      <p className="text-red-500 text-sm h-5 flex items-center transition-all duration-200 ">
        {touchedFields.email && errors.email
          ? errors.email.message
          : " "}
      </p>

      <PasswordInput
        {...register("password")}
        placeholder="Password"
        className="w-full p-3 mb-1 border rounded  focus-within:ring-2 focus-within:ring-blue-500"
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
        {isSubmitting ? "Loading..." : "Sign up"}
      </button>



      <p className="mt-4 text-center text-gray-600">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-500 hover:underline">
          Login
        </Link>
      </p>
    </form>
  );
};

export default RegisterForm;