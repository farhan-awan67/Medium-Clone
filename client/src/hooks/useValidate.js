import { useState } from "react";
import { useSelector } from "react-redux";

export const useValidate = () => {
  const { authTab } = useSelector((state) => state.ui);
  const [validateError, setValidateError] = useState({});

  //   rules for validation
  const validateConfig = {
    email: [{ required: true, message: "Email or username is required" }],
    password: [{ required: true, message: "Password is required" }],
  };

  if (authTab === "Sign up") {
    validateConfig.username = [
      { required: true, message: "Username is required" },
      { minLength: 3, message: "Username must be at least 3 characters" },
    ];
  }

  const validateForm = (data) => {
    const errors = {};
    let hasErrors = false;

    Object.entries(data).forEach(([key, value]) => {
      const rules = validateConfig[key];
      if (!rules) return;

      for (const rule of rules) {
        if (rule.required && value.trim() === "") {
          errors[key] = rule.message;
          hasErrors = true;
          break;
        }

        if (rule.minLength && value.length < rule.minLength) {
          errors[key] = rule.message;
          hasErrors = true;
          break;
        }
      }
    });

    setValidateError(errors);
    return hasErrors; // ✅ true means valid
  };

  return { validateError, validateForm,setValidateError };
};
