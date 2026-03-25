import type { ReactNode } from "react";
import { Input } from "@heroui/input";
import { FormFieldProps } from "@/infrastructure/interfaces/FormFieldProps.ts";

export default function PasswordField({ field, isConfirmation = false }: { field: FormFieldProps, isConfirmation?: boolean }): ReactNode {
    return (
        <Input
            label={isConfirmation ? "Confirmation" : "Mot de passe"}
            placeholder="Votre mot de passe"
            type="password"
            labelPlacement="outside"
            size="sm"
            value={field.state.value}
            onBlur={field.handleBlur}
            onValueChange={(value: string): void => field.handleChange(value)}
            isInvalid={!!field.state.meta.errors.length}
            errorMessage={field.state.meta.errors[0]?.toString()}
        />
    );
}