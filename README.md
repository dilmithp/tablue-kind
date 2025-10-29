This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Unilever Sri Lanka - Trade Analytics Dashboard

A comprehensive analytics dashboard for Unilever Sri Lanka's trade operations, providing real-time insights into sales, forecasts, KPIs, and channel performance.

### Dashboard Routes

- **`/`** (localhost:3000) - **Head of MT Dashboard**
  - Full dashboard with region and channel filters
  - Complete overview of all channels and regions
  - Access to all KPIs, forecasts, and analytics
  
- **`/channel`** (localhost:3000/channel) - **Channel Manager Dashboard**
  - Dedicated dashboard for channel managers
  - Channel selector dropdown (Supermarket, Retail Shop)
  - Shows all regions for the selected channel
  - Same KPIs and analytics filtered by channel

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the Head of MT Dashboard.

Open [http://localhost:3000/channel](http://localhost:3000/channel) to access the Channel Manager Dashboard.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Features

- **Real-time KPIs**: YTD Sales, Growth %, Promo Uplift %, Return Rate %, OOS %
- **Sales Forecasting**: 8-week forecast using SARIMAX model
- **Regional Analytics**: Sri Lanka heatmap with regional performance
- **Channel Analytics**: Sales distribution by channel
- **Achievement Tracking**: Target vs. actual performance by region
- **Top/Bottom Outlets**: Performance ranking tables
- **Top SKUs**: Best performing products
- **Execution Watchlist**: Outlets requiring attention
- **Competitor Insights**: Market intelligence

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!


## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
