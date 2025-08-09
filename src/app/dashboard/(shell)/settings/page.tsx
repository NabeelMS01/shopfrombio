import SettingsForm from "@/components/SettingsForm";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getUserFromSession } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase";
import { redirect } from "next/navigation";

async function getStore(userId: string) {
    if (!userId) return null;
    
    const { data: store } = await supabaseAdmin
      .from('stores')
      .select('*')
      .eq('user_id', userId)
      .single();
      
    return store;
}

export default async function SettingsPage() {
    const user = await getUserFromSession();

    if (!user) {
        redirect('/login');
    }

    const store = await getStore(user.id);
    
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