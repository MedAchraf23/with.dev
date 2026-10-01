import { ReactNode } from 'react';
import { Card, CardBody } from '@heroui/card';
import { Chip } from '@heroui/chip';
import {
    CONTRACT_TYPE_LABELS,
    EXPERIENCE_LEVEL_LABELS,
    JobOffer,
    WORK_MODE_LABELS,
} from '@/features/offres/interfaces/job-offer.type.ts';

interface JobOfferCardProps {
    offer: JobOffer;
}

const AVATAR_COLORS = [
    'bg-brand-500',
    'bg-accent-500',
    'bg-brand-700',
    'bg-accent-700',
];

function formatCompensation(offer: JobOffer): string {
    const format = (amount: number): string => new Intl.NumberFormat('fr-FR').format(amount);

    if (offer.salaryMin !== null && offer.salaryMax !== null) {
        return `${format(offer.salaryMin)} – ${format(offer.salaryMax)} € brut / an`;
    }
    if (offer.tjmMin !== null && offer.tjmMax !== null) {
        return `${format(offer.tjmMin)} – ${format(offer.tjmMax)} € / jour`;
    }
    return 'Rémunération non précisée';
}

function formatPublishedAt(publishedAt: string | null): string {
    if (publishedAt === null) {
        return '';
    }

    const days = Math.floor((Date.now() - new Date(publishedAt).getTime()) / 86_400_000);

    if (days <= 0) {
        return "Publiée aujourd'hui";
    }
    if (days === 1) {
        return 'Publiée hier';
    }
    return `Publiée il y a ${days} jours`;
}

export default function JobOfferCard({ offer }: JobOfferCardProps): ReactNode {
    const avatarColor = AVATAR_COLORS[offer.companyId % AVATAR_COLORS.length];

    return (
        <Card shadow="sm" className="w-full hover:shadow-md transition-shadow">
            <CardBody className="flex flex-row gap-4 p-5">
                <div
                    className={`${avatarColor} shrink-0 w-12 h-12 rounded-lg flex items-center justify-center text-white font-heading text-xl font-bold`}
                    aria-hidden="true"
                >
                    {offer.companyName.charAt(0)}
                </div>

                <div className="flex flex-col gap-2 min-w-0">
                    <div>
                        <h3 className="font-heading text-lg font-semibold truncate">{offer.title}</h3>
                        <p className="text-sm text-foreground-500">
                            {offer.companyName}
                            {offer.city !== null && ` · ${offer.city}`}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Chip size="sm" variant="flat" color="primary">
                            {CONTRACT_TYPE_LABELS[offer.contractType]}
                        </Chip>
                        <Chip size="sm" variant="flat">
                            {WORK_MODE_LABELS[offer.workMode]}
                        </Chip>
                        {offer.experienceLevel !== null && (
                            <Chip size="sm" variant="flat">
                                {EXPERIENCE_LEVEL_LABELS[offer.experienceLevel]}
                            </Chip>
                        )}
                    </div>

                    <p className="text-sm text-foreground-600 line-clamp-2">{offer.description}</p>

                    <div className="flex flex-wrap items-center gap-x-3 text-sm">
                        <span className="font-medium">{formatCompensation(offer)}</span>
                        <span className="text-foreground-400 text-xs">{formatPublishedAt(offer.publishedAt)}</span>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}
