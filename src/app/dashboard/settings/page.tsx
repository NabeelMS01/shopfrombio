import SettingsForm from "@/components/SettingsForm";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import dbConnect from "@/lib/mongoose";
import { getUserFromSession } from "@/lib/session";
import Store from "@/models/Store";
import { redirect } from "next/navigation";

async function getStore(userId: string) {
    if (!userId) return null;
    await dbConnect();
    const store = await Store.findOne({ userId }).lean();
    return store ? JSON.parse(JSON.stringify(store)) : null;
}

export default async function SettingsPage() {
    const user = await getUserFromSession();

    if (!user) {
        redirect('/login');
    }

    const store = await getStore(user._id);
    
    if (!store) {
        // This should be handled by the layout redirect, but as a safeguard.
        return (
            <Card>
                <CardHeader>
                  <CardTitle>Error</CardTitle>
                  <CardDescription>Could not load store data. Ensure a store is created.</CardDescription>
                </CardHeader>
            </Card>
        )
    }

    return <SettingsForm store={store} />;
}
