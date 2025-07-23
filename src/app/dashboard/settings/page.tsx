import SettingsForm from "@/components/SettingsForm";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default async function SettingsPage({ store }: { store: any }) {
    if (!store) {
        return (
            <Card>
                <CardHeader>
                  <CardTitle>Error</CardTitle>
                  <CardDescription>Could not load store data. Please try again later.</CardDescription>
                </CardHeader>
            </Card>
        )
    }

    return <SettingsForm store={store} />;
}
