import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/frontend/components/ui/card";
import { Button } from "@/frontend/components/ui/button";
import { Input } from "@/frontend/components/ui/input";

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <Card className="w-full max-w-md bg-white shadow-soft">
        <CardHeader>
          <CardTitle>Recuperar contrasena</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4">
            <Input label="Correo electronico" name="email" type="email" />
            <Button type="submit" className="w-full">
              Enviar instrucciones
            </Button>
          </form>
          <Link className="mt-5 block text-sm text-brand-700" href="/login">
            Volver al login
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}
