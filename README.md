# ADO Health ICMR

This is a [Next.js](https://nextjs.org/) project bootstrapped with TypeScript, Tailwind CSS, and ESLint.

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

## Project Structure

- `src/app/` - App Router directory containing pages and layouts
- `src/components/` - React components (create as needed)
- `public/` - Static assets

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Email Configuration

To enable email sending for form submissions:

1. Go to [Web3Forms](https://web3forms.com) and get your free access key
2. Create a `.env.local` file in the root directory
3. Add the following line:
   ```
   WEB3FORMS_ACCESS_KEY=your_access_key_here
   ```
4. Restart your development server

The form will send answers to `adohealthicmr2025@gmail.com` when submitted.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
