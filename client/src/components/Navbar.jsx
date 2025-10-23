import { NavLink, useNavigate } from "react-router-dom";
import { toggleLogin } from "../features/uiSlice";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/authSlice";

const Navbar = () => {
  const { showLogin } = useSelector((state) => state.ui);
  const { user, loading, error, token } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <nav className="border-b px-2.5 sm:px-15 flex justify-between items-center">
      <h1
        onClick={() => navigate("/")}
        className="text-[35px] font-bold cursor-pointer"
      >
        WriteUp
      </h1>
      {/* navs */}
      <div className="flex items-center gap-8 font-medium">
        <NavLink to={""}>Write Post</NavLink>
        <NavLink to={""}>Notifications</NavLink>
        {token ? (
          <div className="group relative cursor-pointer">
            <img
              src={user?.avatarUrl || null}
              alt="profile"
              className="w-8 h-8 rounded-full object-cover"
            />
            <ul className="hidden group-hover:block w-[110px] rounded bg-[#fdf8f8] absolute z-10 -right-6 top-8.5 p-2">
              <li
                onClick={() => navigate("/profile")}
                className="text-sm p-1.5"
              >
                Profile
              </li>
              <li onClick={() => dispatch(logout())} className="text-sm p-1.5">
                Logout
              </li>
            </ul>
          </div>
        ) : (
          <button
            onClick={() => dispatch(toggleLogin(!showLogin))}
            className="cursor-pointer px-8 py-2 bg-[#000000]  transition text-white rounded-full"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
