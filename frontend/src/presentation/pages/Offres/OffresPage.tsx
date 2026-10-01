import { ReactNode } from 'react';
import { Spinner } from '@heroui/react';
import { Card, CardBody } from '@heroui/card';
import Heading from '@/presentation/components/Heading.tsx';
import JobOfferCard from '@/features/offres/components/JobOfferCard.tsx';
import JobOfferFilters from '@/features/offres/components/JobOfferFilters.tsx';
import { useJobOffers } from '@/features/offres/hooks/use-job-offers.hook.ts';

export default function OffresPage(): ReactNode {
    const { offers, loading, error, search } = useJobOffers();

    return (
        <section className="max-w-5xl mx-auto px-6 py-10 flex flex-col gap-6">
            <header>
                <Heading level={2}>Offres d'emploi</Heading>
                <p className="text-foreground-500 mt-1">
                    Trouvez la mission ou le poste qui vous correspond.
                </p>
            </header>

            <JobOfferFilters onSearch={search} loading={loading} />

            {!loading && error === null && (
                <p className="text-sm text-foreground-500" aria-live="polite">
                    {offers.length} offre{offers.length > 1 ? 's' : ''} disponible{offers.length > 1 ? 's' : ''}
                </p>
            )}

            {loading && (
                <div className="flex justify-center py-16">
                    <Spinner label="Chargement des offres..." />
                </div>
            )}

            {!loading && error !== null && (
                <Card shadow="none" className="bg-danger-50">
                    <CardBody>
                        <p className="text-danger font-medium">{error}</p>
                    </CardBody>
                </Card>
            )}

            {!loading && error === null && offers.length === 0 && (
                <Card shadow="none" className="bg-accent-50">
                    <CardBody className="text-center py-10">
                        <p className="font-medium">Aucune offre ne correspond à votre recherche</p>
                        <p className="text-sm mt-1">Essayez d'élargir vos critères.</p>
                    </CardBody>
                </Card>
            )}

            {!loading && error === null && offers.length > 0 && (
                <div className="flex flex-col gap-4">
                    {offers.map((offer): ReactNode => (
                        <JobOfferCard key={offer.id} offer={offer} />
                    ))}
                </div>
            )}
        </section>
    );
}
