RUBY := /opt/homebrew/opt/ruby/bin
PATH := $(RUBY):$(PATH)

.PHONY: install serve build clean deploy help

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-12s\033[0m %s\n", $$1, $$2}'

kill: ## Kill any process running on port 4000
	@lsof -ti :4000 | xargs kill -9 2>/dev/null && echo "Killed process on :4000" || echo "Nothing running on :4000"

install: ## Install all gem dependencies
	bundle install

serve: ## Run local dev server at http://localhost:4000
	bundle exec jekyll serve --livereload

serve-drafts: ## Run local dev server including draft posts
	bundle exec jekyll serve --livereload --drafts

build: ## Build the site into _site/
	bundle exec jekyll build

clean: ## Remove generated _site/ folder
	bundle exec jekyll clean

deploy: build ## Build and remind you to push to GitHub Pages
	@echo ""
	@echo "Site built. To deploy, run:"
	@echo "  git add -A && git commit -m 'Update site' && git push"
	@echo ""
