import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/frontend/components/ui/card";
import { Button } from "@/frontend/components/ui/button";
import { Input } from "@/frontend/components/ui/input";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <Card className="w-full max-w-lg bg-white shadow-soft">
        <CardHeader>
          <CardTitle>Registro</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4">
            <Input label="Nombre completo" name="name" />
            <Input label="Correo electronico" name="email" type="email" />
            <Input label="Telefono" name="phone" />
            <Input label="Contrasena" name="password" type="password" />
            <Button type="submit" className="w-full">
              Crear cuenta
            </Button>
          </form>
          <p className="mt-5 text-sm text-slate-600">
            Ya tienes cuenta?{" "}
            <Link className="font-medium text-brand-700" href="/login">
              Inicia sesion
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
