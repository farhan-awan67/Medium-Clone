import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleLogin, setAuthTab } from "../features/uiSlice"; // Adjust the path
import { fetchUser } from "../features/authSlice";
import { useValidate } from "../hooks/useValidate";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import toast from "react-hot-toast";

const Login = () => {
  const { authTab, showLogin } = useSelector((state) => state.ui);
  const dispatch = useDispatch();
  const { user, loading, error, token } = useSelector((state) => state.auth);
  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const { validateError, validateForm, setValidateError } = useValidate();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = validateForm(data);
    if (isValid) return;

    if (authTab === "signup") {
      dispatch(fetchUser({ authTab, credentials: data }))
        .unwrap()
        .then(() => {
          toast.success("signup successfully!");
          setData({ username: "", email: "", password: "" });
        })
        .catch((err) => {
          toast.error(err);
        });
    } else {
      const { email, password } = data;
      dispatch(
        fetchUser({ authTab: "login", credentials: { email, password } })
      )
        .unwrap()
        .then(() => {
          toast.success("login successfully!");
          setData({ email: "", password: "" });
        })
        .catch((err) => {
          toast.error(err);
        });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setValidateError((prev) => ({ ...prev, [name]: "" }));
  };

  if (!showLogin || token) return null;

  // error
  if (error) {
    return toast.error(error);
  }

  return (
    showLogin && (
      <div
        onClick={() => dispatch(toggleLogin(false))}
        className="absolute top-0 left-0 w-full h-screen flex justify-center items-center bg-[#fffbfbb5]"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="mt-7 border border-gray-200 rounded-xl shadow-2xs bg-white"
        >
          <div className="p-4 sm:p-7">
            <div className="text-center">
              <h1 className="block text-2xl font-bold text-black  ">
                {authTab === "Login" ? "Login" : "Sign in"}
              </h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
                Don't have an account yet? {""}
                <span
                  className="cursor-pointer text-blue-600"
                  onClick={() => dispatch(setAuthTab("Sign up"))}
                >
                  Sign up here
                </span>
              </p>
            </div>

            <div className="mt-5">
              {/* <!-- htmlForm --> */}
              <form onSubmit={handleSubmit}>
                <div className="grid gap-y-4">
                  {/* <!-- htmlForm Group --> */}
                  {authTab === "Sign up" ? (
                    <div>
                      <label
                        htmlFor="username"
                        className="block text-sm mb-2 text-black"
                      >
                        Username
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="username"
                          name="username"
                          value={data.username}
                          onChange={(e) => handleChange(e)}
                          className="py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm border focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none "
                          aria-describedby="username-error"
                        />
                      </div>
                      <p
                        className={`${
                          validateError.username ? "block" : "hidden"
                        } text-xs text-red-600 mt-2 `}
                        id="email-error"
                      >
                        {validateError?.username}
                      </p>
                    </div>
                  ) : (
                    ""
                  )}
                  {/* <!-- End htmlForm Group --> */}

                  {/* <!-- htmlForm Group --> */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm mb-2 text-black"
                    >
                      {authTab === "Login"
                        ? "Email address or username"
                        : "Email address"}
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={data.email}
                        onChange={(e) => handleChange(e)}
                        className="py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none bg-white border"
                        aria-describedby="email-error"
                      />
                    </div>
                    <p
                      className={`${
                        validateError.email ? "block" : "hidden"
                      } text-xs text-red-600 mt-2`}
                      id="email-error"
                    >
                      {validateError?.email}
                    </p>
                  </div>
                  {/* <!-- End htmlForm Group --> */}

                  {/* <!-- htmlForm Group --> */}
                  <div>
                    <div className="flex flex-wrap justify-between items-center gap-2">
                      <label
                        htmlFor="password"
                        className="block text-sm mb-2 text-black"
                      >
                        Password
                      </label>
                    </div>
                    <div className="relative">
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={data.password}
                        onChange={(e) => handleChange(e)}
                        className="py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none bg-white border"
                        aria-describedby="password-error"
                      />
                    </div>
                    <p
                      className={`${
                        validateError.password ? "block" : "hidden"
                      } text-xs text-red-600 mt-2"
                      id="password-error`}
                    >
                      {validateError?.password}
                    </p>
                  </div>
                  {/* <!-- End htmlForm Group --> */}

                  <button
                    type="submit"
                    className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                  >
                    {loading ? (
                      <Loading className="w-6 h-6" />
                    ) : authTab === "Login" ? (
                      "Login"
                    ) : (
                      "Sign in"
                    )}
                  </button>
                </div>
              </form>
              {/* <!-- End htmlForm --> */}
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default Login;
