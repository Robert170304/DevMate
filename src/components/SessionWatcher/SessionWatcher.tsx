"use client"
import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";
import { isAfter } from "date-fns"
import { notify } from "@devmate/app/utils/commonFunctions";

export default function SessionWatcher() {
    const { data: session } = useSession()
    useEffect(() => {
        const checkLogout = async () => {

            if (session && isAfter(new Date(), new Date(session.expires))) {
                await signOut();
                notify("Session Expired.", { icon: "✅" });
            }
        };

        const interval = setInterval(checkLogout, 1000); // Check every second
        return () => clearInterval(interval);
    }, [session]);

    return null; // No UI for this watcher
}
