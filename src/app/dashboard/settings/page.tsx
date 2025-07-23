import SettingsForm from "@/components/SettingsForm";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import dbConnect from "@/lib/mongoose";
import { getUserFromSession } from "@/lib/session";
import Store from "@/models/Store";

async function getStore(userId: string) {
    await dbConnect();
    const store = await Store.findOne({ userId }).lean();
    return store ? JSON.parse(JSON.stringify(store)) : null;
}

export default async function SettingsPage() {
    const user = await getUserFromSession();

    if (!user) {
        // This check is a safeguard; middleware should prevent unauthenticated access.
        return (
            <Card>
                <CardHeader>
                  <CardTitle>Authentication Error</CardTitle>
                  <CardDescription>Could not retrieve user session. Please log in again.</CardDescription>
                </CardHeader>
            </Card>
        );
    }

    const store = await getStore(user._id);
    
    if (!store) {
        // This should be handled by the layout redirect, but as a safeguard.
        return (
            <Card>
                <CardHeader>
                  <CardTitle>Error</CardTitle>
                  <CardDescription>Could not load store data. Please create a store first.</CardDescription>
                </CardHeader>
            </Card>
        )
    }

    return <SettingsForm store={store} />;
}
