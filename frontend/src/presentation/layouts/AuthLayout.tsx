import { Outlet } from "react-router-dom";

/**
 * @function AuthLayout
 * @author Arthur MATHIS <arthur.mathis@uha.fr>
 */
export default function AuthLayout() {
    return (
        <div className="w-full h-screen flex items-center justify-center bg-background">
            <Outlet />
        </div>
    );
}