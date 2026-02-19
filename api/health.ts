/**
 * Endpoint de health check.
 */
export default function handler(req: any, res: any): void {
    res.status(200).json({ status: 'ok' });
}