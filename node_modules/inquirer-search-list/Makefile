SHELL := /bin/bash
export PATH := $(shell pwd)/node_modules/.bin:$(PATH)

dev:
	tsc -w

build:
	tsc

publish:build
	npm publish

publishPatch:build
	npm version patch
	npm publish
	git push