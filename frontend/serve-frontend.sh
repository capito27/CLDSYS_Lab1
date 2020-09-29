#!/bin/sh

if [ -z "${FRONTEND_PORT}" ]; then
  vue-cli-service serve # Serve with default port
else
   vue-cli-service serve --port ${FRONTEND_PORT} # Serve with env variable port
fi