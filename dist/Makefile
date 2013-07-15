SPEC=grrreader.spec
VERSION=0.0.5
DIST_DIR=dist
TGZ_NAME=grrreader-$(VERSION).tar.gz
all: rpm

rpm: $(SPEC)

tarball:
	cd ..; git archive --format=tar release | gzip > $(DIST_DIR)/$(TGZ_NAME)

