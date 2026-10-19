import { SignOutButton } from "@/components/Auth/SignOutButton";
import Navbar from "@/components/LandingPageUI/Navbar";
import { requireSession } from "@/lib/auth-utils";
import { Suspense } from "react";

async function DashboardContent(){
    const {user} = await requireSession()

    return(
        <>
        <Navbar />
        <h1 className="text-2xl font-semibold">Hi, {user.name}</h1>
        <p className="text-muted-foreground">Practice dashboard coming soon</p>
        <SignOutButton />
        </>
    )
}


export default function DashboardPage(){
    return(
        <main>
            <Suspense fallback={<p>Loading...</p>}>
                <DashboardContent />
            </Suspense>
        </main>
    )
}