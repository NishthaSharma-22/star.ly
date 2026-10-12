import { Button } from "../ui/button"

function Hero() {
  return (
    <div className="flex flex-col items-center justify-center text-center my-auto">
      <h1 className="mb-10 text-5xl md:text-6xl lg:text-7xl">star.ly</h1>
      <div className="mt-5">
        <form
          action="submit"
          className="flex w-full max-w-md items-center gap-2 border border-zinc-300 bg-white p-1.5"
        >
          <input
            type="email"
            placeholder="Enter your email"
            className="min-w-0 flex-1 outline-none px-3 sm:px-3 sm:text-base"
          />
          <Button type="submit" className="shrink-0 px-5 sm:text-base">
            Start free
          </Button>
        </form>
      </div>
      <p className="mt-4 text-sm">Free to start. No credit card required.</p>
    </div>
  );
}

export default Hero