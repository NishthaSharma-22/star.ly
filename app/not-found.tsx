import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound(){
    return(
        <main className="flex flex-col min-h-[60vh] items-center justify-center text-center gap-4 p-7">
            <h1 className="text-2xl">Page not found</h1>
            <p className="max-w-md text-muted-foreground">The page you are looking for does not exist or has moved.</p>
            <Link href="/" className={buttonVariants()}>Back to home</Link>
        </main>
    )
}