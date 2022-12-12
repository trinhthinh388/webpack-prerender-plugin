prepare:
	./scripts/trigger-release.sh
release:
	./scripts/release.sh $(version)