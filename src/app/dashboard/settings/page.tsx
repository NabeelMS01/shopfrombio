import { getUserFromSession } from "@/lib/session";
import dbConnect from "@/lib/mongoose";
import Store from "@/models/Store";
import { redirect } from "next/navigation";
import SettingsForm from "@/components/SettingsForm";

async function getStoreData() {
    const user = await getUserFromSession();
    if (!user) {
        redirect('/login');
    }

    await dbConnect();
    const store = await Store.findOne({ userId: user._id }).lean();
    
    if (!store) {
      // In a real app, you might want to redirect to a 'create-store' page
      // but for now, we'll just return null. The form will handle this state.
      return null;
    }

    return JSON.parse(JSON.stringify(store));
}


export default async function SettingsPage() {
    const storeData = await getStoreData();

    if (!storeData) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center">
                <h2 className="text-2xl font-bold">No Store Found</h2>
                <p className="text-muted-foreground">Please create a store to access settings.</p>
            </div>
        )
    }

    return <SettingsForm store={storeData} />;
}
