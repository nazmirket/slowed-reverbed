# syntax=docker/dockerfile:1

FROM node:24.18.0-alpine AS build

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable && corepack prepare pnpm@10.33.0 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
	pnpm install --frozen-lockfile

COPY . .

RUN pnpm check && pnpm generate

FROM nginx:1.30.6-alpine AS production

RUN rm -f /etc/nginx/conf.d/default.conf

COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY --from=build --chown=nginx:nginx /app/.output/public /usr/share/nginx/html

USER nginx

EXPOSE 3000

HEALTHCHECK --interval=15s --timeout=3s --start-period=5s --retries=3 \
	CMD wget --quiet --spider http://127.0.0.1:3000/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
