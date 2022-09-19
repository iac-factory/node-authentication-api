FROM public.ecr.aws/amazonlinux/amazonlinux:latest

ARG AWS_SECRET_ACCESS_KEY
ARG AWS_ACCESS_KEY_ID

ARG AWS_DEFAULT_REGION

ARG DISTRIBUTION
ARG NODE_ENV
ARG TARGET
ARG PORT

ENV AWS_SECRET_ACCESS_KEY   "${AWS_SECRET_ACCESS_KEY}"
ENV AWS_ACCESS_KEY_ID       "${AWS_ACCESS_KEY_ID}"

ENV AWS_DEFAULT_REGION      "${AWS_DEFAULT_REGION:-"us-east-2"}"

ENV DISTRIBUTION    "${DISTRIBUTION:-"./distribution"}"
ENV NODE_ENV        "${NODE_ENV:-"development"}"
ENV TARGET          "${TARGET:-"/usr/share/application"}"
ENV PORT            "${PORT:-"3000"}"

WORKDIR "${TARGET}"

RUN yum install wget tar gzip -y

RUN wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
RUN source ~/.nvm/nvm.sh \
    && nvm install --lts \
        && ln -s $(command -v node) /usr/bin/node \
        && ln -s $(command -v npm) /usr/bin/npm

COPY "${DISTRIBUTION}" "${TARGET}"

COPY "package.json" "${TARGET}"
COPY ".env" "${TARGET}"

RUN npm ci --omit dev --omit peer --omit optional

EXPOSE "${PORT}"

CMD [ "node", "." ]
