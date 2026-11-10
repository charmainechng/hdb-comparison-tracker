import type { Request, Response } from 'express';

const HDB_DATASTORE_ENDPOINT =
  'https://data.gov.sg/api/action/datastore_search?resource_id=d_8b84c4ee58e3cfc0ece0d773c8ca6abc';
const ONEMAP_SEARCH_ENDPOINT = 'https://www.onemap.gov.sg/api/common/elastic/search';

/**
 * Serverless handler for live HDB resale prices and amenities data.
 * Adheres to mandatory 'AccountKey' header specification without hardcoded credentials.
 */
export default async function handler(req: Request, res: Response) {
  // Extract AccountKey from environment variable or incoming request header
  const accountKey =
    process.env.ACCOUNT_KEY ||
    (req.headers['accountkey'] as string) ||
    (req.headers['account-key'] as string) ||
    '';

  const type = (req.query.type as string) || (req.body?.type as string) || 'resale';
  const limit = Math.min(200, Math.max(1, parseInt((req.query.limit as string) || req.body?.limit || '50', 10)));
  const offset = parseInt((req.query.offset as string) || req.body?.offset || '0', 10);
  const q = (req.query.q as string) || req.body?.q || '';
  const searchVal = (req.query.searchVal as string) || req.body?.searchVal || 'raffles place';
  const pageNum = parseInt((req.query.pageNum as string) || req.body?.pageNum || '1', 10);

  // Standard outbound headers including required AccountKey
  const outboundHeaders: Record<string, string> = {
    'Accept': 'application/json',
    'User-Agent': 'EstatePulseSG-DataConnector/1.0',
    'AccountKey': accountKey,
  };

  try {
    // 1. Fetch HDB Resale Prices from Data.gov.sg
    if (type === 'resale') {
      const url = new URL(HDB_DATASTORE_ENDPOINT);
      url.searchParams.set('limit', limit.toString());
      url.searchParams.set('offset', offset.toString());
      if (q) {
        url.searchParams.set('q', q);
      }

      const hdbResponse = await fetch(url.toString(), {
        method: 'GET',
        headers: outboundHeaders,
      });

      if (!hdbResponse.ok) {
        const errorText = await hdbResponse.text();
        return res.status(hdbResponse.status).json({
          success: false,
          source: 'data.gov.sg',
          statusCode: hdbResponse.status,
          error: `Data.gov.sg API returned status ${hdbResponse.status}`,
          details: errorText,
          headersSent: {
            AccountKeyHeaderPresent: Boolean(accountKey),
          },
        });
      }

      const hdbData = await hdbResponse.json();
      const records = hdbData?.result?.records || [];

      // Clean and normalize records for application display
      const normalizedRecords = records.map((r: any) => {
        const resalePrice = parseFloat(r.resale_price) || 0;
        const floorAreaSqm = parseFloat(r.floor_area_sqm) || 0;
        const floorAreaSqft = Math.round(floorAreaSqm * 10.7639);
        const psf = floorAreaSqft > 0 ? Math.round(resalePrice / floorAreaSqft) : 0;

        return {
          id: r._id || `${r.month}_${r.block}_${r.street_name}`,
          month: r.month,
          town: r.town,
          flatType: r.flat_type,
          block: r.block,
          streetName: r.street_name,
          storeyRange: r.storey_range,
          floorAreaSqm,
          floorAreaSqft,
          flatModel: r.flat_model,
          leaseCommenceDate: parseInt(r.lease_commence_date, 10) || 1990,
          remainingLease: r.remaining_lease,
          resalePrice,
          psf,
        };
      });

      return res.status(200).json({
        success: true,
        source: 'data.gov.sg',
        endpoint: url.toString(),
        total: hdbData?.result?.total || records.length,
        count: normalizedRecords.length,
        headersSent: {
          AccountKeyHeaderPresent: Boolean(accountKey),
        },
        records: normalizedRecords,
        rawResult: hdbData?.result,
      });
    }

    // 2. Fetch Amenities / Location Data from OneMap
    if (type === 'amenities') {
      const url = new URL(ONEMAP_SEARCH_ENDPOINT);
      url.searchParams.set('searchVal', searchVal);
      url.searchParams.set('returnGeom', 'Y');
      url.searchParams.set('getAddrDetails', 'Y');
      url.searchParams.set('pageNum', pageNum.toString());

      const onemapResponse = await fetch(url.toString(), {
        method: 'GET',
        headers: outboundHeaders,
      });

      if (!onemapResponse.ok) {
        const errorText = await onemapResponse.text();
        return res.status(onemapResponse.status).json({
          success: false,
          source: 'onemap.gov.sg',
          statusCode: onemapResponse.status,
          error: `OneMap API returned status ${onemapResponse.status}`,
          details: errorText,
          headersSent: {
            AccountKeyHeaderPresent: Boolean(accountKey),
          },
        });
      }

      const onemapData = await onemapResponse.json();

      return res.status(200).json({
        success: true,
        source: 'onemap.gov.sg',
        endpoint: url.toString(),
        searchVal,
        found: onemapData?.found || 0,
        pageNum: onemapData?.pageNum || pageNum,
        results: onemapData?.results || [],
        headersSent: {
          AccountKeyHeaderPresent: Boolean(accountKey),
        },
      });
    }

    // 3. Combined live bundle (fetches both for a holistic query)
    if (type === 'all' || type === 'bundle') {
      const hdbUrl = new URL(HDB_DATASTORE_ENDPOINT);
      hdbUrl.searchParams.set('limit', limit.toString());
      if (q) hdbUrl.searchParams.set('q', q);

      const onemapUrl = new URL(ONEMAP_SEARCH_ENDPOINT);
      onemapUrl.searchParams.set('searchVal', searchVal);
      onemapUrl.searchParams.set('returnGeom', 'Y');
      onemapUrl.searchParams.set('getAddrDetails', 'Y');
      onemapUrl.searchParams.set('pageNum', '1');

      const [hdbRes, onemapRes] = await Promise.allSettled([
        fetch(hdbUrl.toString(), { headers: outboundHeaders }).then((r) => r.json()),
        fetch(onemapUrl.toString(), { headers: outboundHeaders }).then((r) => r.json()),
      ]);

      return res.status(200).json({
        success: true,
        type: 'bundle',
        headersSent: {
          AccountKeyHeaderPresent: Boolean(accountKey),
        },
        hdbResale:
          hdbRes.status === 'fulfilled' ? hdbRes.value?.result?.records || [] : { error: hdbRes.reason?.message },
        amenities:
          onemapRes.status === 'fulfilled' ? onemapRes.value?.results || [] : { error: onemapRes.reason?.message },
      });
    }

    return res.status(400).json({
      error: `Invalid type parameter: "${type}". Allowed values: "resale", "amenities", "bundle".`,
    });
  } catch (error: any) {
    console.error('Error in /api/hdbresale handler:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Failed to fetch live HDB resale or amenities data.',
      timestamp: new Date().toISOString(),
    });
  }
}
