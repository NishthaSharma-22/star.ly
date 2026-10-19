import { requireSession } from "@/lib/auth-utils";
import { Suspense } from "react";

async function DashboardContent(){
    const {user} = await requireSession()

    return(
        <>
        <h1 className="text-2xl font-semibold mt-5 px-4">Hi, {user.name}</h1>
        </>
    )
}


export default function DashboardPage(){
    return(
        <main>
            <Suspense fallback={<p className="text-center my-auto">Loading...</p>}>
                <DashboardContent />
            </Suspense>
        </main>
    )
}