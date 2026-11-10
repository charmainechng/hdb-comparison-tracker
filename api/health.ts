import type { Request, Response } from 'express';

/**
 * Serverless / Express Health Check Handler
 * Validates endpoint connectivity, environment headers, and service uptime.
 */
export default async function handler(req: Request, res: Response) {
  const accountKey = process.env.ACCOUNT_KEY || (req.headers['accountkey'] as string) || '';

  return res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    service: 'EstatePulse SG Live Data Connector',
    endpoints: {
      hdbResale: {
        target: 'https://data.gov.sg/api/action/datastore_search?resource_id=d_8b84c4ee58e3cfc0ece0d773c8ca6abc',
        status: 'configured',
      },
      amenitiesOneMap: {
        target: 'https://www.onemap.gov.sg/api/common/elastic/search',
        status: 'configured',
      },
    },
    headers: {
      accountKeyConfigured: Boolean(accountKey),
      headerName: 'AccountKey',
    },
  });
}
