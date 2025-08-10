import Image from "next/image";
import Link from "next/link";
import UserMenu from "./user-menu";
import CartMenu from "./cart-menu";

export const Header = () => {
  return (
    <header className="flex items-center justify-between p-5">
      <Link href="/">
        <Image src="/logo.png" alt="Loomy" width={100} height={26.14} />
      </Link>

      <div className="flex items-center gap-2">
        <CartMenu />
        <UserMenu />
      </div>
    </header>
  );
};
