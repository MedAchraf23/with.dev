import {Card, CardBody, CardHeader} from "@heroui/card";
import Login from "@/features/authentification/components/Login.tsx";
import Mono from "@/presentation/components/Mono.tsx";

export default function AuthPage() {
    return (
        <section className="flex justify-center items-center h-screen w-full">
            <Card className="w-192 h-fit p-6" shadow="sm">
                <CardHeader className="flex justify-center w-full">
                    <Mono level={2}>with.dev</Mono>
                </CardHeader>
                <CardBody className="flex flex-col gap-6 w-full">
                    <Card shadow="none" className="bg-brand-50">
                        <CardBody>
                            <p className="text-sm">Ravis de vous retoruver sur with.dev ! </p>
                            <p className="text-sm">Retrouvez nos offres en vous connectant avec :</p>
                        </CardBody>
                    </Card>
                    <Login />
                </CardBody>
            </Card>
        </section>
    );
};