import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { toggleLogin } from "../features/uiSlice";

const ProtectedRoutes = () => {
  const { showLogin } = useSelector((state) => state.ui);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      toast.error("Please log in");
      dispatch(toggleLogin(!showLogin));
      navigate("/", { replace: true });
    }
  }, [user, dispatch, showLogin, navigate]);

  if (!user) return null;

  return <Outlet />;
};

export default ProtectedRoutes;
