import Link from "next/link";
import { Button, buttonVariants } from "../ui/button"

function Hero() {
  return (
    <div className="flex flex-col items-center justify-center text-center my-auto">
      <h1 className="mb-10 text-5xl md:text-6xl lg:text-7xl">star.ly</h1>
      <div className="mt-5">
        <Link href="/sign-up" className={buttonVariants({size: "lg"})}>
        Get Started!
        </Link>
      </div>
    </div>
  );
}

export default Hero