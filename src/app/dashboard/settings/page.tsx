import { getUserFromSession } from "@/lib/session";
import dbConnect from "@/lib/mongoose";
import Store from "@/models/Store";
import SettingsForm from "@/components/SettingsForm";

async function getStoreData() {
    const user = await getUserFromSession();
    if (!user) {
        // This redirect is now handled by the layout
        return null;
    }

    await dbConnect();
    const store = await Store.findOne({ userId: user._id }).lean();
    
    if (!store) {
      // This case is also handled by the layout now
      return null;
    }

    return JSON.parse(JSON.stringify(store));
}


export default async function SettingsPage() {
    const storeData = await getStoreData();

    if (!storeData) {
        // This should not happen if the layout is working correctly, but as a fallback:
        return (
            <div className="flex flex-col items-center justify-center h-full text-center">
                <h2 className="text-2xl font-bold">Store Not Found</h2>
                <p className="text-muted-foreground">Could not load store settings.</p>
            </div>
        )
    }

    return <SettingsForm store={storeData} />;
}
