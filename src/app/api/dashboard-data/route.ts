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
        // New robust logic
        const params: (string | number)[] = [];
        let paramIndex = 1;
        const baseSalesWhere: string[] = [];
        const baseOosWhere: string[] = [`EXTRACT(YEAR FROM vsc.visit_date) = 2024`];
        const baseOutletWhere: string[] = [`status = 'Active'`];
        const baseTargetWhere: string[] = [`EXTRACT(YEAR FROM t.period_start) = 2024`];
        const basePromoWhere: string[] = [`st.fiscal_year = 2024`, `st.return_flag = 0`];
        const baseReturnMatrixWhere: string[] = [`st.fiscal_year = 2024`, `st.return_flag = 1`];

        if (region && region !== 'All Regions') {
            baseSalesWhere.push(`region = $${paramIndex}`);
            baseOosWhere.push(`om.region = $${paramIndex}`);
            baseOutletWhere.push(`region = $${paramIndex}`);
            baseTargetWhere.push(`om.region = $${paramIndex}`);
            basePromoWhere.push(`st.region = $${paramIndex}`);
            baseReturnMatrixWhere.push(`st.region = $${paramIndex}`);
            params.push(region);
            paramIndex++;
        }

        if (channel && channel !== 'All Channels') {
            baseSalesWhere.push(`channel = $${paramIndex}`);
            baseOosWhere.push(`om.channel = $${paramIndex}`);
            baseOutletWhere.push(`channel = $${paramIndex}`);
            baseTargetWhere.push(`om.channel = $${paramIndex}`);
            basePromoWhere.push(`st.channel = $${paramIndex}`);
            baseReturnMatrixWhere.push(`st.channel = $${paramIndex}`);
            params.push(channel);
            paramIndex++;
        }

        // --- 3. BUILD FINAL SQL WHERE STRINGS ---
        const buildWhereClause = (baseConditions: string[]) => {
            return baseConditions.length > 0 ? `WHERE ${baseConditions.join(' AND ')}` : '';
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
        const returnMatrixWhereSql = buildWhereClause(baseReturnMatrixWhere);

        // --- 4. DEFINE ALL QUERIES ---
        const client = await pool.connect();
        console.log("Database connection successful!");

        // --- QUERY 1: YTD SALES (2024) ---
        const ytdSalesQuery = `
            SELECT COALESCE(SUM(net_sales), 0) AS "ytdSales"
            FROM sales_transactions
                     ${salesWhere2024};
        `;

        // --- QUERY 2: RETURN RATE % (2024) ---
        const returnRateQuery = `
            SELECT
                CASE
                    WHEN SUM(net_sales) = 0 OR SUM(net_sales) IS NULL THEN 0
                    ELSE (COALESCE(SUM(CASE WHEN return_flag = 1 THEN net_sales ELSE 0 END), 0) / SUM(net_sales)) * 100
                    END AS "returnRate"
            FROM sales_transactions
                     ${returnRateWhere};
        `;

        // --- QUERY 3: CHANNEL SALES (2024) ---
        const channelQuery = `
            SELECT channel, SUM(net_sales) as "sales"
            FROM sales_transactions
                     ${salesWhere2024}
            GROUP BY channel
            ORDER BY sales DESC;
        `;

        // --- QUERY 4: SALES FORECAST DATA (for main chart) ---
        const forecastQuery = `
            SELECT week, series AS "model", value, lower, upper, isfuture AS "isForecast"
            FROM timeseries_for_tableau;
        `;

        // --- QUERY 5: PREVIOUS YEAR SALES (2023) ---
        const sales2023Query = `
            SELECT COALESCE(SUM(net_sales), 0) AS "sales2023"
            FROM sales_transactions
                     ${salesWhere2023};
        `;

        // --- QUERY 6: OOS RATE % (2024) ---
        const oosQuery = `
            SELECT
                CASE
                    WHEN COUNT(vsc.visit_id) = 0 OR COUNT(vsc.visit_id) IS NULL THEN 0
                    ELSE (COALESCE(SUM(vsc.oos_flag), 0) * 1.0 / COUNT(vsc.visit_id)) * 100
                    END AS "oosRate"
            FROM visit_stock_capture vsc
                ${oosJoinSql}
                ${oosWhereSql};
        `;

        // --- QUERY 7: ACTIVE OUTLET COUNT ---
        const outletCountQuery = `
            SELECT COALESCE(COUNT(DISTINCT outlet_id), 0) AS "outletCount"
            FROM outlet_master
                     ${outletWhereSql};
        `;

        // --- QUERY 8: ACTIVE SKU COUNT ---
        const skuCountQuery = `
            SELECT COALESCE(COUNT(DISTINCT sku_id), 0) AS "skuCount"
            FROM sku_master
            WHERE active_flag = 1;
        `;

        // --- QUERY 9: GET REGION LIST FOR FILTER ---
        const regionListQuery = `SELECT DISTINCT region FROM outlet_master ORDER BY region;`;

        // --- QUERY 10: GET CHANNEL LIST FOR FILTER ---
        const channelListQuery = `SELECT DISTINCT channel FROM outlet_master ORDER BY channel;`;

        // --- QUERY 11: PROMO UPLIFT (2024) ---
        const promoUpliftQuery = `
            WITH PromoSales AS (
                SELECT DISTINCT st.transaction_id, st.net_sales, st.transaction_date
                FROM sales_transactions st
                         JOIN promotions p ON st.sku_id = p.sku_id_or_group AND st.transaction_date BETWEEN p.start_date AND p.end_date
                ${promoWhereSql}
                ), BaselineSales AS (
            SELECT st.net_sales, st.transaction_date
            FROM sales_transactions st
                JOIN promotions p ON st.sku_id = p.sku_id_or_group
                LEFT JOIN PromoSales ps ON st.transaction_id = ps.transaction_id
            WHERE ps.transaction_id IS NULL
                ${promoWhereSql.length > 0 ? promoWhereSql.replace('WHERE', 'AND') : ''} -- Reuse promo conditions but as AND
                ), PromoAgg AS (
            SELECT COALESCE(SUM(net_sales), 0) as "totalPromoSales",
                COALESCE(COUNT(DISTINCT transaction_date), 0) as "promoDays"
            FROM PromoSales
                ), BaselineAgg AS (
            SELECT COALESCE(SUM(net_sales), 0) as "totalBaselineSales",
                COALESCE(COUNT(DISTINCT transaction_date), 0) as "baselineDays"
            FROM BaselineSales
                )
            SELECT
                pa."totalPromoSales", ba."totalBaselineSales", pa."promoDays", ba."baselineDays",
                CASE
                    WHEN ba."baselineDays" = 0 OR ba."totalBaselineSales" = 0 THEN 0
                    WHEN pa."promoDays" = 0 THEN -100
                    ELSE ((pa."totalPromoSales" / pa."promoDays") - (ba."totalBaselineSales" / ba."baselineDays")) / (ba."totalBaselineSales" / ba."baselineDays") * 100
                    END AS "promoUpliftPercent"
            FROM PromoAgg pa, BaselineAgg ba;
        `;

        // --- QUERY 12: 8-WEEK FORECAST TABLE ---
        const forecastTableQuery = `
            SELECT week, prophet, naive_seasonal, sarima, sarimax_promo
            FROM forecast_table_8w ORDER BY week ASC LIMIT 8;
        `;

        // --- QUERY 13: ACHIEVEMENT BY REGION (2024) ---
        const achievementQuery = `
            WITH SalesByRegion AS (
                SELECT region, COALESCE(SUM(net_sales), 0) as "totalSales"
                FROM sales_transactions
                ${salesWhere2024} GROUP BY region
            ), TargetsByRegion AS (
                SELECT om.region, COALESCE(SUM(t.target_amount), 0) as "totalTarget"
                FROM targets t ${targetJoinSql} ${targetWhereSql} GROUP BY om.region
            )
            SELECT
                COALESCE(s.region, t.region) as "name",
                s."totalSales", t."totalTarget",
                CASE WHEN t."totalTarget" = 0 OR t."totalTarget" IS NULL THEN 0 ELSE (s."totalSales" / t."totalTarget") * 100 END as "achievement"
            FROM SalesByRegion s FULL OUTER JOIN TargetsByRegion t ON s.region = t.region
            ORDER BY "achievement" DESC;
        `;

        // --- QUERY 14: RETURN RATE MATRIX (2024) ---
        // Calculate percentage of returns by reason for each portfolio
        const returnMatrixQuery = `
            WITH ReturnTotals AS (
                SELECT
                    sm.portfolio,
                    r.reason,
                    COALESCE(SUM(r.returned_qty), 0) as "return_qty"
                FROM returns r
                JOIN sku_master sm ON r.sku_id = sm.sku_id
                JOIN outlet_master om ON r.outlet_id = om.outlet_id
                WHERE EXTRACT(YEAR FROM r.return_date) = 2024
                ${baseSalesWhere.length > 0 ? 'AND ' + baseSalesWhere.map(clause => {
                    return clause.replace('region =', 'om.region =').replace('channel =', 'om.channel =');
                }).join(' AND ') : ''}
                GROUP BY sm.portfolio, r.reason
            ),
            PortfolioTotals AS (
                SELECT
                    portfolio,
                    SUM("return_qty") as "total_portfolio_returns"
                FROM ReturnTotals
                GROUP BY portfolio
            )
            SELECT
                rt.portfolio,
                rt.reason,
                CASE
                    WHEN pt."total_portfolio_returns" = 0 OR pt."total_portfolio_returns" IS NULL THEN 0
                    ELSE (rt."return_qty" * 100.0 / pt."total_portfolio_returns")
                END as "return_value"
            FROM ReturnTotals rt
            JOIN PortfolioTotals pt ON rt.portfolio = pt.portfolio
            ORDER BY rt.portfolio, rt.reason;
        `;


        // --- 5. EXECUTE ALL QUERIES ---
        console.log("Running all 14 queries with params:", params);
        const [
            ytdSalesResult, returnRateResult, channelResult, forecastResult, sales2023Result, oosResult,
            outletCountResult, skuCountResult, regionListResult, channelListResult, promoUpliftResult,
            forecastTableResult, achievementResult, returnMatrixResult
        ] = await Promise.all([
            client.query(ytdSalesQuery, params), client.query(returnRateQuery, params), client.query(channelQuery, params),
            client.query(forecastQuery), client.query(sales2023Query, params), client.query(oosQuery, params),
            client.query(outletCountQuery, params), client.query(skuCountQuery), client.query(regionListQuery),
            client.query(channelListQuery), client.query(promoUpliftQuery, params), client.query(forecastTableQuery),
            client.query(achievementQuery, params), client.query(returnMatrixQuery, params)
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
        const kpis = {
            ytdSales: ytdSales, returnRate: returnRateResult.rows[0]?.returnRate,
            growthPercent: growthPercent, oosRate: oosResult.rows[0]?.oosRate,
            promoUplift: promoUpliftResult.rows[0]?.promoUpliftPercent
        };
        const channels = channelResult.rows;
        const salesForecast = forecastResult.rows;
        const outletCount = outletCountResult.rows[0]?.outletCount;
        const skuCount = skuCountResult.rows[0]?.skuCount;
        const forecastTable = forecastTableResult.rows;
        const achievementData = achievementResult.rows;
        const returnMatrixData = returnMatrixResult.rows;
        const regionList = ["All Regions", ...regionListResult.rows.map(r => r.region)];
        const channelList = ["All Channels", ...channelListResult.rows.map(r => r.channel)];

        // --- 7. SEND THE FULL RESPONSE ---
        return NextResponse.json({
            kpis, channels, salesForecast, outletCount, skuCount, regionList, channelList,
            forecastTable, achievementData, returnMatrixData, lastUpdated: new Date().toISOString()
        });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { message: 'Error fetching data', error: (error as Error).message }, { status: 500 }
        );
    }
}