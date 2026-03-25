export interface FormFieldProps {
    state: {
        value: string;
        meta: {
            errors: unknown[];
        };
    };
    handleBlur: () => void;
    handleChange: (value: string) => void;
}