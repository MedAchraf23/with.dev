import { FormEvent, ReactNode, useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { Input, Textarea } from '@heroui/input';
import { Select, SelectItem } from '@heroui/select';
import { Switch } from '@heroui/switch';
import { Button } from '@heroui/button';
import Heading from '@/presentation/components/Heading.tsx';
import { validateRequired } from '@/infrastructure/validators/required.validator.ts';
import {
    CONTRACT_TYPE_LABELS,
    ContractType,
    WORK_MODE_LABELS,
    WorkMode,
} from '@/types/common.type.ts';
import { CandidateProfileFormValues } from '@/features/candidat/interfaces/candidate.type.ts';

interface CandidateProfileFormProps {
    initialValues: CandidateProfileFormValues;
    onSave: (values: CandidateProfileFormValues) => Promise<void>;
    saving: boolean;
}

export default function CandidateProfileForm({
    initialValues,
    onSave,
    saving,
}: CandidateProfileFormProps): ReactNode {
    const [missingFields, setMissingFields] = useState<string[]>([]);

    const form = useForm({
        defaultValues: initialValues,
        onSubmit: async ({ value }: { value: CandidateProfileFormValues }): Promise<void> => {
            const missing = [
                validateRequired(value.firstName, 'Prénom'),
                validateRequired(value.lastName, 'Nom'),
            ].filter((message): message is string => message !== undefined);

            setMissingFields(missing);

            if (missing.length === 0) {
                await onSave(value);
            }
        },
    });

    return (
        <form
            noValidate
            className="flex flex-col gap-8"
            onSubmit={async (event: FormEvent): Promise<void> => {
                event.preventDefault();
                event.stopPropagation();
                await form.handleSubmit();
            }}
        >
            <fieldset className="flex flex-col gap-4">
                <Heading level={4}>Identité</Heading>

                <div className="flex flex-col sm:flex-row gap-4">
                    <form.Field name="firstName">
                        {(field) => (
                            <Input
                                className="flex-1"
                                isRequired
                                label="Prénom"
                                value={field.state.value}
                                onValueChange={field.handleChange}
                            />
                        )}
                    </form.Field>

                    <form.Field name="lastName">
                        {(field) => (
                            <Input
                                className="flex-1"
                                isRequired
                                label="Nom"
                                value={field.state.value}
                                onValueChange={field.handleChange}
                            />
                        )}
                    </form.Field>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <form.Field name="phone">
                        {(field) => (
                            <Input
                                className="flex-1"
                                label="Téléphone"
                                value={field.state.value}
                                onValueChange={field.handleChange}
                            />
                        )}
                    </form.Field>

                    <form.Field name="city">
                        {(field) => (
                            <Input
                                className="flex-1"
                                label="Ville"
                                value={field.state.value}
                                onValueChange={field.handleChange}
                            />
                        )}
                    </form.Field>
                </div>
            </fieldset>

            <fieldset className="flex flex-col gap-4">
                <Heading level={4}>Présentation</Heading>

                <form.Field name="headline">
                    {(field) => (
                        <Input
                            label="Titre"
                            placeholder="Développeur Java en recherche d'alternance"
                            value={field.state.value}
                            onValueChange={field.handleChange}
                        />
                    )}
                </form.Field>

                <form.Field name="bio">
                    {(field) => (
                        <Textarea
                            label="À propos"
                            minRows={4}
                            value={field.state.value}
                            onValueChange={field.handleChange}
                        />
                    )}
                </form.Field>
            </fieldset>

            <fieldset className="flex flex-col gap-4">
                <Heading level={4}>Liens</Heading>

                <form.Field name="cvUrl">
                    {(field) => (
                        <Input
                            label="Lien vers votre CV"
                            placeholder="https://drive.google.com/..."
                            value={field.state.value}
                            onValueChange={field.handleChange}
                        />
                    )}
                </form.Field>

                <div className="flex flex-col sm:flex-row gap-4">
                    <form.Field name="linkedinUrl">
                        {(field) => (
                            <Input
                                className="flex-1"
                                label="LinkedIn"
                                placeholder="https://www.linkedin.com/in/..."
                                value={field.state.value}
                                onValueChange={field.handleChange}
                            />
                        )}
                    </form.Field>

                    <form.Field name="githubUrl">
                        {(field) => (
                            <Input
                                className="flex-1"
                                label="GitHub"
                                placeholder="https://github.com/..."
                                value={field.state.value}
                                onValueChange={field.handleChange}
                            />
                        )}
                    </form.Field>
                </div>
            </fieldset>

            <fieldset className="flex flex-col gap-4">
                <Heading level={4}>Votre recherche</Heading>

                <form.Field name="preferredContractTypes">
                    {(field) => (
                        <Select
                            label="Types de contrat souhaités"
                            selectionMode="multiple"
                            selectedKeys={field.state.value}
                            onSelectionChange={(keys): void =>
                                field.handleChange(Array.from(keys as Set<ContractType>))
                            }
                        >
                            {Object.values(ContractType).map((type: ContractType): JSX.Element => (
                                <SelectItem key={type}>{CONTRACT_TYPE_LABELS[type]}</SelectItem>
                            ))}
                        </Select>
                    )}
                </form.Field>

                <form.Field name="preferredWorkMode">
                    {(field) => (
                        <Select
                            label="Mode de travail souhaité"
                            selectedKeys={field.state.value === '' ? [] : [field.state.value]}
                            onSelectionChange={(keys): void =>
                                field.handleChange((Array.from(keys as Set<WorkMode>)[0] ?? '') as WorkMode | '')
                            }
                        >
                            {Object.values(WorkMode).map((mode: WorkMode): JSX.Element => (
                                <SelectItem key={mode}>{WORK_MODE_LABELS[mode]}</SelectItem>
                            ))}
                        </Select>
                    )}
                </form.Field>

                <div className="flex flex-col sm:flex-row gap-4">
                    <form.Field name="yearsOfExperience">
                        {(field) => (
                            <Input
                                className="flex-1"
                                type="number"
                                min={0}
                                label="Années d'expérience"
                                value={field.state.value}
                                onValueChange={field.handleChange}
                            />
                        )}
                    </form.Field>

                    <form.Field name="desiredSalaryMin">
                        {(field) => (
                            <Input
                                className="flex-1"
                                type="number"
                                min={0}
                                label="Salaire minimum (€ / an)"
                                value={field.state.value}
                                onValueChange={field.handleChange}
                            />
                        )}
                    </form.Field>

                    <form.Field name="desiredSalaryMax">
                        {(field) => (
                            <Input
                                className="flex-1"
                                type="number"
                                min={0}
                                label="Salaire maximum (€ / an)"
                                value={field.state.value}
                                onValueChange={field.handleChange}
                            />
                        )}
                    </form.Field>
                </div>

                <form.Field name="isOpenToWork">
                    {(field) => (
                        <Switch
                            isSelected={field.state.value}
                            onValueChange={field.handleChange}
                        >
                            Ouvert aux opportunités
                        </Switch>
                    )}
                </form.Field>
            </fieldset>

            {missingFields.length > 0 && (
                <p className="text-danger text-sm" role="alert">
                    {missingFields.join(', ')}
                </p>
            )}

            <Button type="submit" className="self-start text-white bg-black" isLoading={saving}>
                Enregistrer mon profil
            </Button>
        </form>
    );
}
