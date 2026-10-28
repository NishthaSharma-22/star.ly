import { User } from "lucide-react";
import { SignOutButton } from "../Auth/SignOutButton";
import { requireSession } from "@/lib/auth-utils";

async function Navbar() {
  const { user } = await requireSession();

  return (
    <>
      <div className="flex justify-between p-5 items-center bg-secondary">
        <div>
          {/* TODO: replace text with logo here later */}
          <p>Star.ly</p>
        </div>
        <div className="flex items-center gap-4">
          {/* name and log out buttons here */}
          <span className="flex items-center gap-2">
            <User size={25} />
            {user.name}
          </span>
          <SignOutButton />
        </div>
      </div>
    </>
  );
}

export default Navbar;
