import Navbar from "@/components/LandingPageUI/Navbar";
import { Suspense } from "react";

export default function AppLayout({ children }: { children: React.ReactNode }){
    return(
        <>
        <Suspense fallback={<div className="h-16 bg-secondary" />}>
            <Navbar />
        </Suspense>
        {children}
        </>
    )
};
