import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import Breadcrumbs from "./Breadcrumbs";

function Header() {
  const { user } = useUser();

  return (
    <div className="flex justify-between items-center p-4">
      {user && (
        <Link to="/">
          <h1 className="text-2xl font-semibold">
            {" "}
            {user?.firstName}
            {`'s`} Space{" "}
          </h1>
        </Link>
      )}
      
      <Breadcrumbs />

      <SignedOut>
        <SignInButton />
      </SignedOut>

      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  );
}

export default Header;
