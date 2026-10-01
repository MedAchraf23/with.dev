import { FormEvent, ReactNode, useState } from 'react';
import { Input } from '@heroui/input';
import { Select, SelectItem } from '@heroui/select';
import { Button } from '@heroui/button';
import {
    CONTRACT_TYPE_LABELS,
    ContractType,
    EMPTY_CRITERIA,
    JobOfferSearchCriteria,
    WORK_MODE_LABELS,
    WorkMode,
} from '@/features/offres/interfaces/job-offer.type.ts';

interface JobOfferFiltersProps {
    onSearch: (criteria: JobOfferSearchCriteria) => void;
    loading: boolean;
}

interface Option {
    key: string;
    label: string;
}

const ALL = 'ALL';

const CONTRACT_OPTIONS: Option[] = [
    { key: ALL, label: 'Tous les contrats' },
    ...Object.values(ContractType).map((type: ContractType): Option => ({
        key: type,
        label: CONTRACT_TYPE_LABELS[type],
    })),
];

const WORK_MODE_OPTIONS: Option[] = [
    { key: ALL, label: 'Tous les modes' },
    ...Object.values(WorkMode).map((mode: WorkMode): Option => ({
        key: mode,
        label: WORK_MODE_LABELS[mode],
    })),
];

export default function JobOfferFilters({ onSearch, loading }: JobOfferFiltersProps): ReactNode {
    const [criteria, setCriteria] = useState<JobOfferSearchCriteria>(EMPTY_CRITERIA);

    const selectedValue = (keys: unknown): string => {
        const value = Array.from(keys as Set<string>)[0];
        return value === undefined || value === ALL ? '' : value;
    };

    const applyFilter = (updated: JobOfferSearchCriteria): void => {
        setCriteria(updated);
        onSearch(updated);
    };

    return (
        <form
            className="flex flex-col gap-3"
            onSubmit={(event: FormEvent): void => {
                event.preventDefault();
                onSearch(criteria);
            }}
        >
            <div className="flex flex-col sm:flex-row gap-3">
                <Input
                    className="flex-1"
                    label="Métier, technologie, mot-clé"
                    value={criteria.search}
                    onValueChange={(search: string): void => setCriteria({ ...criteria, search })}
                />
                <Input
                    className="flex-1"
                    label="Ville"
                    value={criteria.city}
                    onValueChange={(city: string): void => setCriteria({ ...criteria, city })}
                />
                <Button type="submit" className="sm:w-40 sm:h-14 text-white bg-black" isLoading={loading}>
                    Rechercher
                </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <Select
                    className="flex-1"
                    label="Type de contrat"
                    selectedKeys={[criteria.contractType === '' ? ALL : criteria.contractType]}
                    onSelectionChange={(keys): void =>
                        applyFilter({ ...criteria, contractType: selectedValue(keys) as ContractType | '' })
                    }
                >
                    {CONTRACT_OPTIONS.map((option: Option): JSX.Element => (
                        <SelectItem key={option.key}>{option.label}</SelectItem>
                    ))}
                </Select>

                <Select
                    className="flex-1"
                    label="Mode de travail"
                    selectedKeys={[criteria.workMode === '' ? ALL : criteria.workMode]}
                    onSelectionChange={(keys): void =>
                        applyFilter({ ...criteria, workMode: selectedValue(keys) as WorkMode | '' })
                    }
                >
                    {WORK_MODE_OPTIONS.map((option: Option): JSX.Element => (
                        <SelectItem key={option.key}>{option.label}</SelectItem>
                    ))}
                </Select>
            </div>
        </form>
    );
}
