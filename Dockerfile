FROM node:alpine

ARG DISTRIBUTION
ARG NODE_ENV
ARG TARGET
ARG PORT

ENV DISTRIBUTION    "${DISTRIBUTION:-"."}"
ENV NODE_ENV        "${NODE_ENV:-"production"}"
ENV TARGET          "${TARGET:-"/usr/share/application"}"
ENV PORT            "${PORT:-"3000"}"

WORKDIR "${TARGET}"

COPY .env "${TARGET}"

COPY "${DISTRIBUTION}" "${TARGET}"

EXPOSE "${PORT}"

RUN npm install --omit dev --omit optional --omit peer