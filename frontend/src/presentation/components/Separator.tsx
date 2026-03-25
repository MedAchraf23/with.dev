import { ReactNode } from "react";
import { Divider } from "@heroui/divider";

export default function Separator(): ReactNode  {
    return (
        <div className="flex items-center gap-4">
            <Divider className="flex-1" />
            <span className="text-foreground-500 text-sm">ou</span>
            <Divider className="flex-1" />
        </div>
    );
}