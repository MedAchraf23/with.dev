import type { ReactNode } from "react";
import { Input } from "@heroui/input";
import { FormFieldProps } from "@/infrastructure/interfaces/FormFieldProps.ts";

export default function EmailField({ field }: { field: FormFieldProps }): ReactNode {
    return (
        <Input
            label="Email"
            placeholder="exemple@email.com"
            type="email"
            labelPlacement="outside"
            size="sm"
            value={field.state.value}
            onBlur={field.handleBlur}
            onValueChange={(v) => field.handleChange(v)}
            isInvalid={!!field.state.meta.errors.length}
            errorMessage={field.state.meta.errors[0]?.toString()}
        />
    );
}