import { DeleteAccountForm } from "@/components/Account/DeleteAccountForm";
import { requireSession } from "@/lib/auth-utils";
import { Suspense } from "react";

async function AccountContent(){
    const {user} = await requireSession()

    return(
        <>
        <h1 className="text-2xl font-semibold">Account</h1>
        <section className="flex flex-col gap-1">
            <p>
                <span className="text-muted-foreground">Name:</span>{user.name}
            </p>
            <p>
                <span className="text-muted-foreground">Email:</span>{user.email}
            </p>
        </section>
        <section className="flex flex-col gap-3 border p-4">
            <h2 className="text-lg font-semibold">Delete account</h2>
            <DeleteAccountForm />
        </section>
        </>
    )
}

export default function AccountPage(){
    return(
        <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-4">
            <Suspense fallback={<p>Loading...</p>}>
            <AccountContent />

            </Suspense>
        </main>
    )
}