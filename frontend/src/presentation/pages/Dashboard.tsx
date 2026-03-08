import {useEffect} from "react";
import AuthService from "@/features/authentification/services/auth.service.ts";

export default function Dashboard() {
    useEffect(() => {
        AuthService.getSession().then((session) => {
            console.log('session:', session)
        });
    });

    return <p>Bonjour</p>;
}