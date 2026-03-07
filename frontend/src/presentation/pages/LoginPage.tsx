import {Image} from "@heroui/image";
import {Login} from "@/features/authentification/components/Login.tsx";

export const LoginPage = () => {
    return (
        <section className="flex h-screen w-full">
            <aside className="flex-1 h-full overflow-hidden">
                <Image src="/illustration-img.jpg" className="w-full h-full object-cover rounded-none" />
            </aside>

            <article className="flex-1 flex flex-col items-center justify-center">
                <h1 className="text-5xl font-bold mb-8">with.dev</h1>
                <Login />
            </article>
        </section>
    );
};