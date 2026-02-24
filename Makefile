# Démarrer les conteneurs
start:
	@echo "Démarrage des conteneurs..."
	docker-compose up -d

# Arrêter les conteneurs
stop:
	@echo "Arrêt des conteneurs..."
	docker-compose down

# Redémarrer les conteneurs
restart: stop start
	@echo "Redémarrage des conteneurs..."

# Reconstruire les images
build:
	@echo "Reconstruction des images..."
	docker-compose build --no-cache

# Supprimer les conteneurs, réseaux et volumes
clean:
	@echo "Nettoyage des ressources Docker..."
	docker-compose down -v

# Afficher l'état des conteneurs
status:
	@echo "État des conteneurs..."
	docker-compose ps

# Afficher les logs
logs:
	@echo "Affichage des logs..."
	docker-compose logs -f

.PHONY: start stop restart build clean status logs