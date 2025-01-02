# ---------------- Stage 1: BUILD ----------------
    FROM node:20-alpine AS build
    WORKDIR /app
    
    # Copy package manifest
    COPY package.json pnpm-lock.yaml ./
    COPY .env ./
    
    # Install pnpm, then all dependencies
    RUN npm install -g pnpm
    RUN pnpm install
    
    # Copy the rest of your code (pages, components, etc.)
    COPY . .
    
    # Build Next.js (outputs into .next)
    RUN pnpm run build
    
    # ---------------- Stage 2: RUNTIME ----------------
    FROM node:20-alpine
    WORKDIR /app
    
    # Copy only the needed files from build
    COPY --from=build /app/package.json ./
    COPY --from=build /app/pnpm-lock.yaml ./
    COPY --from=build /app/.next ./.next
    COPY --from=build /app/public ./public
    COPY --from=build /app/next.config.mjs .
    # If you have other config files needed at runtime, copy them too:
    COPY --from=build /app/.env ./
    
    # Install pnpm + production deps only
    RUN npm install -g pnpm
    RUN pnpm install --prod
    
    # By default, Next.js runs on port 3000. Adjust if needed:
    EXPOSE 3000
    
    # Provide a default command: "start" uses the Next.js production build
    ENV PORT=3000
    CMD ["pnpm", "start:prod"]
    