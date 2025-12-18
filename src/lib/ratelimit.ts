const rateLimit = new Map<string, number[]>();

export function checkRateLimit(ip: string, limit: number = 10, windowMs: number = 60000): boolean {
  const now = Date.now();
  const timestamps = rateLimit.get(ip) || [];
  
  // Filter out timestamps older than the window
  const validTimestamps = timestamps.filter(t => now - t < windowMs);
  
  if (validTimestamps.length >= limit) {
    return false;
  }
  
  validTimestamps.push(now);
  rateLimit.set(ip, validTimestamps);
  return true;
}
