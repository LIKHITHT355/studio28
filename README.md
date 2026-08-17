# Studios 28

Photography studio portfolio website for Studios 28, Bangalore.

Live at [studios28.in](https://studios28.in)

## Built with
- TanStack Start
- TypeScript
- React
- Tailwind CSS
- MongoDB (via Mongoose)
- Cloudflare Workers (deployment)

## Features
- Public portfolio gallery with category-based filtering (Wedding, Pre-Wedding, Portrait, Events, Other)
- Admin dashboard for managing gallery assets
- Image uploads via Cloudinary integration

## Development

```bash
bun install
bun run dev
```

## Deployment

Deployed automatically via Cloudflare Workers on push to `main`.

```bash
bun run build
npx wrangler deploy
```
