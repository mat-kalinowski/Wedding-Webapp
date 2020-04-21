# Makefile for db operations

migrations:
	[ ! -f wdapp.db ] && \
	sqlite3 wdapp.db < ./wdapp.sql 

.PHONY: migrations