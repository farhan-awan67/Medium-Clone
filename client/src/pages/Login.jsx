import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleLogin, setAuthTab } from "../features/uiSlice"; // Adjust the path

const Login = () => {
  const { authTab, showLogin } = useSelector((state) => state.ui);
  const dispatch = useDispatch();
  console.log(useSelector((state) => state.ui));
  console.log(authTab, showLogin);

  return (
    showLogin && (
      <div
        onClick={() => dispatch(toggleLogin(!showLogin))}
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
                Don't have an account yet?
                <span onClick={() => dispatch(setAuthTab("Sign up"))}>
                  Sign up here
                </span>
              </p>
            </div>

            <div className="mt-5">
              {/* <!-- htmlForm --> */}
              <form>
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
                          name="usrname"
                          className="py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm border focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none "
                          required
                          aria-describedby="username-error"
                        />
                        <div className="hidden absolute inset-y-0 end-0 pointer-events-none pe-3">
                          <svg
                            className="size-5 text-red-500"
                            width="16"
                            height="16"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                            aria-hidden="true"
                          >
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                          </svg>
                        </div>
                      </div>
                      <p
                        className="hidden text-xs text-red-600 mt-2"
                        id="email-error"
                      >
                        Please include a valid email address so we can get back
                        to you
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
                        className="py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none bg-white border"
                        required
                        aria-describedby="email-error"
                      />
                      <div className="hidden absolute inset-y-0 end-0 pointer-events-none pe-3">
                        <svg
                          className="size-5 text-red-500"
                          width="16"
                          height="16"
                          fill="currentColor"
                          viewBox="0 0 16 16"
                          aria-hidden="true"
                        >
                          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                        </svg>
                      </div>
                    </div>
                    <p
                      className="hidden text-xs text-red-600 mt-2"
                      id="email-error"
                    >
                      Please include a valid email address so we can get back to
                      you
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
                        className="py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none bg-white border"
                        required
                        aria-describedby="password-error"
                      />
                      <div className="hidden absolute inset-y-0 end-0 pointer-events-none pe-3">
                        <svg
                          className="size-5 text-red-500"
                          width="16"
                          height="16"
                          fill="currentColor"
                          viewBox="0 0 16 16"
                          aria-hidden="true"
                        >
                          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                        </svg>
                      </div>
                    </div>
                    <p
                      className="hidden text-xs text-red-600 mt-2"
                      id="password-error"
                    >
                      8+ characters required
                    </p>
                  </div>
                  {/* <!-- End htmlForm Group --> */}

                  <button
                    type="submit"
                    className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    Sign in
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
