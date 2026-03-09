package uha.miage.backend.domain.favorite.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uha.miage.backend.domain.favorite.entity.SavedJobOffer;
import uha.miage.backend.domain.favorite.entity.SavedJobOfferId;

@Repository
public interface SavedJobOfferRepository extends JpaRepository<SavedJobOffer, SavedJobOfferId> {
}
