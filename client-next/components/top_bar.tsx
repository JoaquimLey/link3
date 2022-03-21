import Auth from "./auth";
import { Logo } from "./icons/logo";
import NavBar from "./nav_bar";

const links = [
  {
    href: "/",
    text: "Home",
  },
  {
    href: "/dashboard",
    text: "Dashboard",
  },
]

const TopBar = () => {
  return (
    <>
      <div className="flex items-center justify-between px-4 ">
        <Logo className="w-32 aspect-square rounded-full " />
        <NavBar links={links} />
        <Auth />
      </div>
    </>
  );
}

export default TopBar;