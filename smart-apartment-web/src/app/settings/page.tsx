import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function SettingsPage() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight text-white">Settings</h2>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Application Settings</CardTitle>
                    <CardDescription>Configure your Smart Apartment system.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        Settings page is under construction. More options coming soon.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
