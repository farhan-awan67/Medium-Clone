import { NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const user = false;

  return (
    <nav className="border-b px-2.5 sm:px-15 flex justify-between items-center">
      <h1 onClick={() => navigate("/")} className="text-[35px] font-bold">
        WriteUp
      </h1>
      {/* navs */}
      <div className="flex items-center gap-8 font-medium">
        <NavLink to={""}>Write Post</NavLink>
        <NavLink to={""}>Notifications</NavLink>
        {user ? (
          <div className="group relative cursor-pointer">
            <img src={""} alt="profile" className="w-8 h-8" />
            <ul className="hidden group-hover:block w-[110px] rounded bg-[#fdf8f8] absolute z-10 -right-6 top-8.5 p-2">
              <li
                onClick={() => navigate("/profile")}
                className="text-sm p-1.5"
              >
                Profile
              </li>
              <li className="text-sm p-1.5">Logout</li>
            </ul>
          </div>
        ) : (
          <button
            onClick={() => setShowLogin(!showLogin)}
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
