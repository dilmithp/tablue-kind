// src/app/api/dashboard-data/route.ts
import { NextResponse } from 'next/server';
import { pool } from '@/lib/db'; // Import the connection pool

export const dynamic = 'force-dynamic'; // Ensures the data is always fresh

export async function GET(request: Request) {
    console.log("API route hit! Attempting to connect to database...");

    try {
        // --- 1. READ FILTERS FROM URL ---
        const { searchParams } = new URL(request.url);
        const region = searchParams.get('region');
        const channel = searchParams.get('channel');
        console.log(`Filters received: Region=${region}, Channel=${channel}`);

        // --- 2. BUILD DYNAMIC PARAMS & WHERE CLAUSES ---
        // Using the robust logic from your working file
        const params: (string | number)[] = [];
        let paramIndex = 1;
        const baseSalesWhere: string[] = [];
        const baseOosWhere: string[] = [`EXTRACT(YEAR FROM vsc.visit_date) = 2024`];
        const baseOutletWhere: string[] = [`status = 'Active'`];
        const baseTargetWhere: string[] = [`EXTRACT(YEAR FROM t.period_start) = 2024`];
        const basePromoWhere: string[] = [`st.fiscal_year = 2024`, `st.return_flag = 0`];
        // baseReturnMatrixWhere removed as it's handled differently in user's Q14
        const baseReturnQtyWhere: string[] = [`EXTRACT(YEAR FROM r.return_date) = 2024`]; // For user's Q14

        if (region && region !== 'All Regions') {
            baseSalesWhere.push(`region = $${paramIndex}`);
            baseOosWhere.push(`om.region = $${paramIndex}`);
            baseOutletWhere.push(`region = $${paramIndex}`);
            baseTargetWhere.push(`om.region = $${paramIndex}`);
            basePromoWhere.push(`st.region = $${paramIndex}`);
            baseReturnQtyWhere.push(`om.region = $${paramIndex}`); // Filter returns query
            params.push(region);
            paramIndex++;
        }

        if (channel && channel !== 'All Channels') {
            baseSalesWhere.push(`channel = $${paramIndex}`);
            baseOosWhere.push(`om.channel = $${paramIndex}`);
            baseOutletWhere.push(`channel = $${paramIndex}`);
            baseTargetWhere.push(`om.channel = $${paramIndex}`);
            basePromoWhere.push(`st.channel = $${paramIndex}`);
            baseReturnQtyWhere.push(`om.channel = $${paramIndex}`); // Filter returns query
            params.push(channel);
            paramIndex++;
        }

        // --- 3. BUILD FINAL SQL WHERE STRINGS ---
        // Using the robust logic from your working file
        const buildWhereClause = (baseConditions: string[], useAnd?: boolean) => {
            const prefix = useAnd ? 'AND' : 'WHERE';
            // Filter out empty strings that might result from conditional logic
            const validConditions = baseConditions.filter(cond => cond && cond.trim() !== '');
            return validConditions.length > 0 ? `${prefix} ${validConditions.join(' AND ')}` : '';
        };

        const salesWhere2024 = buildWhereClause(['fiscal_year = 2024', 'return_flag = 0', ...baseSalesWhere]);
        const salesWhere2023 = buildWhereClause(['fiscal_year = 2023', 'return_flag = 0', ...baseSalesWhere]);
        const returnRateWhere = buildWhereClause(['fiscal_year = 2024', ...baseSalesWhere]);
        const oosJoinSql = `LEFT JOIN outlet_master om ON vsc.outlet_id = om.outlet_id`;
        const oosWhereSql = buildWhereClause(baseOosWhere);
        const outletWhereSql = buildWhereClause(baseOutletWhere);
        const targetJoinSql = `JOIN outlet_master om ON t.outlet_id = om.outlet_id`;
        const targetWhereSql = buildWhereClause(baseTargetWhere);
        const promoWhereSql = buildWhereClause(basePromoWhere);
        const returnQtyJoinSql = `JOIN sku_master sm ON r.sku_id = sm.sku_id JOIN outlet_master om ON r.outlet_id = om.outlet_id`;
        const returnQtyWhereSql = buildWhereClause(baseReturnQtyWhere);
        // Additional clauses for new tables (reuse existing logic where possible)
        const salesFilterAsAnd = buildWhereClause(baseSalesWhere, true);
        const targetFilterAsAnd = buildWhereClause(baseTargetWhere.slice(1), true); // remove year condition for join
        const oosFilterAsAnd = buildWhereClause(baseOosWhere.slice(1), true); // remove year condition for join
        // Clause for OutletReturnValues needed in Q15, Q17
        const outletReturnValuesWhere = buildWhereClause(['fiscal_year = 2024', 'return_flag = 1', ...baseSalesWhere]);
        // Clause for SkuReturnValues needed in Q16
        const skuReturnValuesWhere = buildWhereClause(['fiscal_year = 2024', 'return_flag = 1', ...baseSalesWhere]);


        // --- 4. DEFINE ALL QUERIES ---
        const client = await pool.connect();
        console.log("Database connection successful!");

        // --- Queries 1-13 (From your working file) ---
        // --- QUERY 1: YTD SALES (2024) ---
        const ytdSalesQuery = `SELECT COALESCE(SUM(net_sales), 0) AS "ytdSales" FROM sales_transactions ${salesWhere2024};`;
        // --- QUERY 2: RETURN RATE % (2024) ---
        const returnRateQuery = `SELECT CASE WHEN SUM(net_sales) = 0 OR SUM(net_sales) IS NULL THEN 0 ELSE (COALESCE(SUM(CASE WHEN return_flag = 1 THEN net_sales ELSE 0 END), 0) / SUM(net_sales)) * 100 END AS "returnRate" FROM sales_transactions ${returnRateWhere};`;
        // --- QUERY 3: CHANNEL SALES (2024) ---
        const channelQuery = `SELECT channel, SUM(net_sales) as "sales" FROM sales_transactions ${salesWhere2024} GROUP BY channel ORDER BY sales DESC;`;
        // --- QUERY 4: SALES FORECAST DATA (for main chart) ---
        const forecastQuery = `SELECT week, series AS "model", value, lower, upper, isfuture AS "isForecast" FROM timeseries_for_tableau;`;
        // --- QUERY 5: PREVIOUS YEAR SALES (2023) ---
        const sales2023Query = `SELECT COALESCE(SUM(net_sales), 0) AS "sales2023" FROM sales_transactions ${salesWhere2023};`;
        // --- QUERY 6: OOS RATE % (2024) ---
        const oosQuery = `SELECT CASE WHEN COUNT(vsc.visit_id) = 0 OR COUNT(vsc.visit_id) IS NULL THEN 0 ELSE (COALESCE(SUM(vsc.oos_flag), 0) * 1.0 / COUNT(vsc.visit_id)) * 100 END AS "oosRate" FROM visit_stock_capture vsc ${oosJoinSql} ${oosWhereSql};`;
        // --- QUERY 7: ACTIVE OUTLET COUNT ---
        const outletCountQuery = `SELECT COALESCE(COUNT(DISTINCT outlet_id), 0) AS "outletCount" FROM outlet_master ${outletWhereSql};`;
        // --- QUERY 8: ACTIVE SKU COUNT ---
        const skuCountQuery = `SELECT COALESCE(COUNT(DISTINCT sku_id), 0) AS "skuCount" FROM sku_master WHERE active_flag = 1;`;
        // --- QUERY 9: GET REGION LIST FOR FILTER ---
        const regionListQuery = `SELECT DISTINCT region FROM outlet_master ORDER BY region;`;
        // --- QUERY 10: GET CHANNEL LIST FOR FILTER ---
        const channelListQuery = `SELECT DISTINCT channel FROM outlet_master ORDER BY channel;`;
        // --- QUERY 11: PROMO UPLIFT (2024) ---
        const promoUpliftQuery = `WITH PromoSales AS (SELECT DISTINCT st.transaction_id, st.net_sales, st.transaction_date FROM sales_transactions st JOIN promotions p ON st.sku_id = p.sku_id_or_group AND st.transaction_date BETWEEN p.start_date AND p.end_date ${promoWhereSql}), BaselineSales AS (SELECT st.net_sales, st.transaction_date FROM sales_transactions st JOIN promotions p ON st.sku_id = p.sku_id_or_group LEFT JOIN PromoSales ps ON st.transaction_id = ps.transaction_id WHERE ps.transaction_id IS NULL ${promoWhereSql.length > 0 ? promoWhereSql.replace('WHERE', 'AND') : ''}), PromoAgg AS (SELECT COALESCE(SUM(net_sales), 0) as "totalPromoSales", COALESCE(COUNT(DISTINCT transaction_date), 0) as "promoDays" FROM PromoSales), BaselineAgg AS (SELECT COALESCE(SUM(net_sales), 0) as "totalBaselineSales", COALESCE(COUNT(DISTINCT transaction_date), 0) as "baselineDays" FROM BaselineSales) SELECT pa."totalPromoSales", ba."totalBaselineSales", pa."promoDays", ba."baselineDays", CASE WHEN ba."baselineDays" = 0 OR ba."totalBaselineSales" = 0 THEN 0 WHEN pa."promoDays" = 0 THEN -100 ELSE ((pa."totalPromoSales" / pa."promoDays") - (ba."totalBaselineSales" / ba."baselineDays")) / (ba."totalBaselineSales" / ba."baselineDays") * 100 END AS "promoUpliftPercent" FROM PromoAgg pa, BaselineAgg ba;`;
        // --- QUERY 12: 8-WEEK FORECAST TABLE ---
        const forecastTableQuery = `SELECT week, prophet, naive_seasonal, sarima, sarimax_promo FROM forecast_table_8w ORDER BY week ASC LIMIT 8;`;
        // --- QUERY 13: ACHIEVEMENT BY REGION (2024) ---
        const achievementQuery = `WITH SalesByRegion AS (SELECT region, COALESCE(SUM(net_sales), 0) as "totalSales" FROM sales_transactions ${salesWhere2024} GROUP BY region), TargetsByRegion AS (SELECT om.region, COALESCE(SUM(t.target_amount), 0) as "totalTarget" FROM targets t ${targetJoinSql} ${targetWhereSql} GROUP BY om.region) SELECT COALESCE(s.region, t.region) as "name", COALESCE(s."totalSales", 0) as "totalSales", COALESCE(t."totalTarget", 0) as "totalTarget", CASE WHEN COALESCE(t."totalTarget", 0) = 0 THEN 0 ELSE (COALESCE(s."totalSales", 0) / t."totalTarget") * 100 END as "achievement" FROM SalesByRegion s FULL OUTER JOIN TargetsByRegion t ON s.region = t.region ORDER BY "achievement" DESC;`;
        // --- QUERY 14: RETURN RATE MATRIX (2024) --- (User's working version)
        const returnMatrixQuery = `WITH ReturnTotals AS ( SELECT sm.portfolio, r.reason, COALESCE(SUM(r.returned_qty), 0) as "return_qty" FROM returns r ${returnQtyJoinSql} ${returnQtyWhereSql} GROUP BY sm.portfolio, r.reason ), PortfolioTotals AS ( SELECT portfolio, SUM("return_qty") as "total_portfolio_returns" FROM ReturnTotals GROUP BY portfolio ) SELECT rt.portfolio, rt.reason, CASE WHEN pt."total_portfolio_returns" = 0 OR pt."total_portfolio_returns" IS NULL THEN 0 ELSE (rt."return_qty" * 100.0 / pt."total_portfolio_returns") END as "return_value" FROM ReturnTotals rt JOIN PortfolioTotals pt ON rt.portfolio = pt.portfolio ORDER BY rt.portfolio, rt.reason;`;


        // --- NEW QUERIES START HERE ---

        // --- QUERY 15: TOP/BOTTOM OUTLETS DATA (2024) ---
        // Calculates multiple metrics per outlet
        const outletPerformanceQuery = `
            WITH OutletSales AS (
                SELECT outlet_id, SUM(net_sales) as "sales_2024"
                FROM sales_transactions
                         ${salesWhere2024}
                GROUP BY outlet_id
            ), OutletSalesPrev AS (
                SELECT outlet_id, SUM(net_sales) as "sales_2023"
                FROM sales_transactions
                         ${salesWhere2023}
                GROUP BY outlet_id
            ), OutletTargets AS (
                SELECT t.outlet_id, SUM(t.target_amount) as "target_2024"
                FROM targets t
                ${targetJoinSql} ${targetWhereSql} -- Use JOIN and WHERE from logic above
            GROUP BY t.outlet_id
                ), OutletReturnValues AS ( -- Renamed to avoid clash with user Q14
            SELECT outlet_id, COALESCE(SUM(ABS(net_sales)), 0) as "returns_value_2024"
            FROM sales_transactions
                ${outletReturnValuesWhere} -- Use specific clause for returns
            GROUP BY outlet_id
                ), OutletOOS AS (
            SELECT vsc.outlet_id, AVG(vsc.oos_flag) * 100 as "oos_2024"
            FROM visit_stock_capture vsc
                ${oosJoinSql} ${oosWhereSql} -- Use JOIN and WHERE from logic above
            GROUP BY vsc.outlet_id
                ), LastVisit AS (
            SELECT outlet_id, MAX(visit_date) as "last_visit_date"
            FROM visit_stock_capture
            GROUP BY outlet_id
                )
            SELECT
                om.outlet_id, -- Keep ID for potential linking
                om.outlet_name as "outlet", om.region, om.territory,
                COALESCE(s.sales_2024, 0) as "sales",
                COALESCE(t.target_2024, 0) as "target",
                CASE WHEN COALESCE(t.target_2024, 0) = 0 THEN 0 ELSE (COALESCE(s.sales_2024, 0) / t.target_2024) * 100 END as "achievement",
                COALESCE(oos.oos_2024, 0) as "oos_percent",
                -- Return % calculation based on Net Sales + Return Value (Approximates Gross Sales)
                CASE
                    WHEN (COALESCE(s.sales_2024, 0) + COALESCE(rv.returns_value_2024, 0)) = 0 THEN 0
                    ELSE (COALESCE(rv.returns_value_2024, 0) / (COALESCE(s.sales_2024, 0) + COALESCE(rv.returns_value_2024, 0))) * 100
                    END as "return_percent",
                COALESCE(sp.sales_2023, 0) as "sales_prev",
                -- Growth % calculation
                CASE
                    WHEN COALESCE(sp.sales_2023, 0) = 0 THEN 0 -- Handle division by zero if no previous year sales
                    ELSE ((COALESCE(s.sales_2024, 0) - sp.sales_2023) / sp.sales_2023) * 100
                    END as "growth_percent",
                lv.last_visit_date
            FROM outlet_master om
                     LEFT JOIN OutletSales s ON om.outlet_id = s.outlet_id
                     LEFT JOIN OutletSalesPrev sp ON om.outlet_id = sp.outlet_id
                     LEFT JOIN OutletTargets t ON om.outlet_id = t.outlet_id
                     LEFT JOIN OutletReturnValues rv ON om.outlet_id = rv.outlet_id
                     LEFT JOIN OutletOOS oos ON om.outlet_id = oos.outlet_id
                     LEFT JOIN LastVisit lv ON om.outlet_id = lv.outlet_id
                ${outletWhereSql}; -- Apply filters directly on outlet_master (status, region, channel)
        `;

        // --- QUERY 16: TOP SKUS DATA (2024) ---
        // Calculates performance metrics per SKU
        const skuPerformanceQuery = `
            WITH SkuSales AS (
                SELECT sku_id, SUM(net_sales) as "sales_2024"
                FROM sales_transactions
                         ${salesWhere2024}
                GROUP BY sku_id
            ), SkuReturnValues AS ( -- Renamed to avoid clash
                SELECT sku_id, COALESCE(SUM(ABS(net_sales)), 0) as "returns_value_2024"
                FROM sales_transactions
                         ${skuReturnValuesWhere} -- Use specific clause for SKU returns
                GROUP BY sku_id
            ), SkuOOS AS (
                SELECT vsc.sku_id, AVG(vsc.oos_flag) * 100 as "oos_2024"
                FROM visit_stock_capture vsc
                ${oosJoinSql} ${oosWhereSql} -- Reuse join and filters
            GROUP BY vsc.sku_id
                ), SkuPromoUplift AS (
            -- Reusing the main promo uplift calculation logic, adapted for SKU
            SELECT
                p.sku_id_or_group as sku_id,
                CASE
                WHEN COALESCE(SUM(baseline."totalBaselineSales"), 0) = 0 OR COALESCE(SUM(baseline."baselineDays"), 0) = 0 THEN 0
                WHEN COALESCE(SUM(promo."totalPromoSales"), 0) = 0 OR COALESCE(SUM(promo."promoDays"), 0) = 0 THEN -100
                ELSE
                -- Check denominator is not zero before division
                CASE
                WHEN (COALESCE(SUM(baseline."totalBaselineSales"), 0) / COALESCE(SUM(baseline."baselineDays"), 1)) = 0 THEN 0 -- Avoid division by zero in the final step
                ELSE
                (
                (COALESCE(SUM(promo."totalPromoSales"), 0) / COALESCE(SUM(promo."promoDays"), 1))
                -
                (COALESCE(SUM(baseline."totalBaselineSales"), 0) / COALESCE(SUM(baseline."baselineDays"), 1))
                )
                /
                (COALESCE(SUM(baseline."totalBaselineSales"), 0) / COALESCE(SUM(baseline."baselineDays"), 1)) * 100
                END
                END AS "calculated_promo_uplift"
            FROM promotions p
                LEFT JOIN (
                -- Promo Sales for this SKU
                SELECT st.sku_id, SUM(st.net_sales) as "totalPromoSales", COUNT(DISTINCT st.transaction_date) as "promoDays"
                FROM sales_transactions st
                JOIN promotions pr ON st.sku_id = pr.sku_id_or_group AND st.transaction_date BETWEEN pr.start_date AND pr.end_date
                ${promoWhereSql} GROUP BY st.sku_id
                ) promo ON p.sku_id_or_group = promo.sku_id
                LEFT JOIN (
                -- Baseline Sales for this SKU (non-promo periods)
                SELECT st.sku_id, SUM(st.net_sales) as "totalBaselineSales", COUNT(DISTINCT st.transaction_date) as "baselineDays"
                FROM sales_transactions st
                -- Check if the transaction date falls within ANY promotion for this SKU
                LEFT JOIN promotions pr ON st.sku_id = pr.sku_id_or_group AND st.transaction_date BETWEEN pr.start_date AND pr.end_date
                WHERE pr.promo_id IS NULL -- Include only sales outside of any promo period for this SKU
                ${promoWhereSql.length > 0 ? promoWhereSql.replace('WHERE', 'AND') : ''} GROUP BY st.sku_id
                ) baseline ON p.sku_id_or_group = baseline.sku_id
            WHERE EXTRACT(YEAR FROM p.start_date) = 2024
            GROUP BY p.sku_id_or_group
                )
            SELECT
                sm.sku_name as "sku",
                COALESCE(s.sales_2024, 0) as "sales",
                COALESCE(pu.calculated_promo_uplift, 0) as "promo_uplift_percent",
                CASE
                    WHEN (COALESCE(s.sales_2024, 0) + COALESCE(rv.returns_value_2024, 0)) = 0 THEN 0
                    ELSE (COALESCE(rv.returns_value_2024, 0) / (COALESCE(s.sales_2024, 0) + COALESCE(rv.returns_value_2024, 0))) * 100
                    END as "return_percent",
                COALESCE(oos.oos_2024, 0) as "oos_percent"
            FROM sku_master sm
                     LEFT JOIN SkuSales s ON sm.sku_id = s.sku_id
                     LEFT JOIN SkuReturnValues rv ON sm.sku_id = rv.sku_id
                     LEFT JOIN SkuOOS oos ON sm.sku_id = oos.sku_id
                     LEFT JOIN SkuPromoUplift pu ON sm.sku_id = pu.sku_id
            WHERE sm.active_flag = 1 AND COALESCE(s.sales_2024, 0) > 0 -- Only show active SKUs with sales in 2024
            ORDER BY sales DESC
                LIMIT 20; -- Limit to top 20 SKUs by sales
        `;

        // --- QUERY 17: EXECUTION WATCHLIST DATA (2024) ---
        // Identifies outlets needing attention based on OOS, Growth, and Returns
        // This query reuses CTEs defined within Q15 for efficiency, ensure Q15 structure supports this
        const watchlistQuery = `
            WITH OutletSales AS (
                SELECT outlet_id, SUM(net_sales) as "sales_2024"
                FROM sales_transactions ${salesWhere2024} GROUP BY outlet_id
            ), OutletSalesPrev AS (
                SELECT outlet_id, SUM(net_sales) as "sales_2023"
                FROM sales_transactions ${salesWhere2023} GROUP BY outlet_id
            ), OutletReturnValues AS (
                SELECT outlet_id, COALESCE(SUM(ABS(net_sales)), 0) as "returns_value_2024"
                FROM sales_transactions ${outletReturnValuesWhere} GROUP BY outlet_id
            ), OutletOOS AS (
                SELECT vsc.outlet_id, AVG(vsc.oos_flag) * 100 as "oos_2024"
                FROM visit_stock_capture vsc ${oosJoinSql} ${oosWhereSql} GROUP BY vsc.outlet_id
                ), OutletPerformanceMetrics AS ( -- Renamed CTE from Q15 to avoid conflict if run separately
            SELECT
                om.outlet_id, om.outlet_name as "outlet", om.region, om.territory,
                COALESCE(s.sales_2024, 0) as "sales",
                CASE WHEN (COALESCE(s.sales_2024, 0) + COALESCE(rv.returns_value_2024, 0)) = 0 THEN 0 ELSE (COALESCE(rv.returns_value_2024, 0) / (COALESCE(s.sales_2024, 0) + COALESCE(rv.returns_value_2024, 0))) * 100 END as "return_percent",
                COALESCE(sp.sales_2023, 0) as "sales_prev",
                CASE WHEN COALESCE(sp.sales_2023, 0) = 0 THEN 0 ELSE ((COALESCE(s.sales_2024, 0) - sp.sales_2023) / sp.sales_2023) * 100 END as "growth_percent",
                COALESCE(oos.oos_2024, 0) as "oos_percent"
            FROM outlet_master om
                LEFT JOIN OutletSales s ON om.outlet_id = s.outlet_id
                LEFT JOIN OutletSalesPrev sp ON om.outlet_id = sp.outlet_id
                LEFT JOIN OutletReturnValues rv ON om.outlet_id = rv.outlet_id
                LEFT JOIN OutletOOS oos ON om.outlet_id = oos.outlet_id
                ${outletWhereSql} -- Apply filters
                )
            SELECT outlet, region, territory, oos_percent, growth_percent, return_percent
            FROM OutletPerformanceMetrics -- Use renamed CTE
            WHERE oos_percent > 10 AND (growth_percent < 0 OR return_percent > 2.5) -- Updated thresholds: OOS > 10% AND (Neg Growth OR Returns > 2.5%)
            ORDER BY oos_percent DESC, growth_percent ASC; -- Prioritize highest OOS, then lowest growth
        `;


        // --- 5. EXECUTE ALL QUERIES ---
        console.log("Running all 17 queries with params:", params);
        const [
            ytdSalesResult, returnRateResult, channelResult, forecastResult, sales2023Result, oosResult,
            outletCountResult, skuCountResult, regionListResult, channelListResult, promoUpliftResult,
            forecastTableResult, achievementResult, returnMatrixResult,
            outletPerformanceResult, skuPerformanceResult, watchlistResult // NEW
        ] = await Promise.all([
            client.query(ytdSalesQuery, params), client.query(returnRateQuery, params), client.query(channelQuery, params),
            client.query(forecastQuery), client.query(sales2023Query, params), client.query(oosQuery, params),
            client.query(outletCountQuery, params), client.query(skuCountQuery), client.query(regionListQuery),
            client.query(channelListQuery), client.query(promoUpliftQuery, params), client.query(forecastTableQuery),
            client.query(achievementQuery, params), client.query(returnMatrixQuery, params),
            client.query(outletPerformanceQuery, params), // NEW
            client.query(skuPerformanceQuery, params),   // NEW
            client.query(watchlistQuery, params)        // NEW
        ]);
        console.log("All queries successful!");
        client.release();

        // --- 6. ORGANIZE THE DATA ---
        const ytdSales = ytdSalesResult.rows[0]?.ytdSales || 0;
        const sales2023 = sales2023Result.rows[0]?.sales2023 || 0;
        let growthPercent = 0;
        if (sales2023 > 0) {
            growthPercent = ((ytdSales - sales2023) / sales2023) * 100;
        }
        const kpis = { ytdSales: ytdSales, returnRate: returnRateResult.rows[0]?.returnRate, growthPercent: growthPercent, oosRate: oosResult.rows[0]?.oosRate, promoUplift: promoUpliftResult.rows[0]?.promoUpliftPercent };
        const channels = channelResult.rows;
        const salesForecast = forecastResult.rows;
        const outletCount = outletCountResult.rows[0]?.outletCount;
        const skuCount = skuCountResult.rows[0]?.skuCount;
        const forecastTable = forecastTableResult.rows;
        const achievementData = achievementResult.rows;
        const returnMatrixData = returnMatrixResult.rows;
        const regionList = ["All Regions", ...regionListResult.rows.map(r => r.region)];
        const channelList = ["All Channels", ...channelListResult.rows.map(r => r.channel)];
        // Separate Top/Bottom Outlets
        const allOutlets = outletPerformanceResult.rows.sort((a: any, b: any) => b.achievement - a.achievement); // Sort by achievement descending
        const topOutlets = allOutlets.slice(0, 5);
        // Sort by achievement ascending for bottom, then take top 5 and reverse to show worst first
        const bottomOutlets = [...allOutlets].sort((a: any, b: any) => a.achievement - b.achievement).slice(0, 5); //.reverse();
        const topSkus = skuPerformanceResult.rows; // Already sorted and limited in SQL
        const watchlistOutlets = watchlistResult.rows;

        // --- 7. SEND THE FULL RESPONSE ---
        return NextResponse.json({
            kpis, channels, salesForecast, outletCount, skuCount, regionList, channelList,
            forecastTable, achievementData, returnMatrixData,
            topOutlets: topOutlets,               // NEW
            bottomOutlets: bottomOutlets,         // NEW
            topSkus: topSkus,                 // NEW
            watchlistOutlets: watchlistOutlets, // NEW
            lastUpdated: new Date().toISOString()
        });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { message: 'Error fetching data', error: (error as Error).message }, { status: 500 }
        );
    }
}