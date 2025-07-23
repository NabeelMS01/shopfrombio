import SettingsForm from "@/components/SettingsForm";

export default async function SettingsPage({ store }: { store: any }) {
    if (!store) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center">
                <h2 className="text-2xl font-bold">Store Not Found</h2>
                <p className="text-muted-foreground">Could not load store settings. Your session might be invalid.</p>
            </div>
        )
    }

    return <SettingsForm store={store} />;
}
