import React, { useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Tab, Tabs } from "@heroui/tabs";
import Mono from "@/presentation/components/Mono.tsx";
import SignIn from "@/features/authentification/components/SignIn.tsx";
import SignUp from "@/features/authentification/components/SignUp.tsx";

export function AuthPage() {
    const [selectedTab, setSelectedTab] = useState("signin");

    return (
        <section className="flex justify-center items-center h-screen w-full">
            <Card className="w-192 h-fit p-6" shadow="sm">
                <CardHeader className="flex justify-center w-full">
                    <Mono level={2}>with.dev</Mono>
                </CardHeader>
                <CardBody className="flex flex-col gap-3 w-full">
                    <Tabs
                        fullWidth
                        aria-label="Tabs form"
                        selectedKey={selectedTab}
                        size="md"
                        onSelectionChange={(key: React.Key): void => setSelectedTab(String(key))}
                    >
                        <Tab key="signin" title="Se connecter">
                            <div className="flex flex-col gap-6">
                                <Card shadow="none" className="bg-brand-50">
                                    <CardBody>
                                        <p className="font-medium mb-0.5">Ravis de vous retrouver sur with.dev 👋</p>
                                        <p className="text-sm">Retrouvez nos offres en vous connectant avec :</p>
                                    </CardBody>
                                </Card>
                                <SignIn/>
                            </div>
                        </Tab>
                        <Tab key="signup" title="S'inscrire">
                            <div className="flex flex-col gap-6">
                                <Card shadow="none" className="bg-accent-50">
                                    <CardBody>
                                        <p className="font-medium mb-0.5">Bienvenue sur with.dev 🎉</p>
                                        <p className="text-sm">Inscrivez vous en choisissant votre méthode de connexion :</p>
                                    </CardBody>
                                </Card>
                                <SignUp/>
                            </div>
                        </Tab>
                    </Tabs>
                </CardBody>
            </Card>
        </section>
    );
}