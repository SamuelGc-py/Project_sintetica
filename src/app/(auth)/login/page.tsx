import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/frontend/components/ui/card";
import { Button } from "@/frontend/components/ui/button";
import { Input } from "@/frontend/components/ui/input";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <Card className="w-full max-w-md bg-white shadow-soft">
        <CardHeader>
          <CardTitle>Iniciar sesion</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4">
            <Input label="Correo electronico" name="email" type="email" />
            <Input label="Contrasena" name="password" type="password" />
            <Button type="submit" className="w-full">
              Entrar
            </Button>
          </form>
          <div className="mt-5 flex items-center justify-between text-sm">
            <Link className="text-brand-700" href="/forgot-password">
              Recuperar contrasena
            </Link>
            <Link className="text-brand-700" href="/register">
              Crear cuenta
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
