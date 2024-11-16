import { Request, Response, NextFunction } from 'express';

function hasSQLInjection(input: string): boolean {
  const sqlInjectionPatterns = [
    // Common SQL injection patterns
    /(\%27)|(\')|(\-\-)|(\%23)|(#)/i, // e.g., ' or -- or #
    /((\%3D)|(=))[^\n]*((\%27)|(\')|(\-\-)|(\%3B)|(;))/i, // e.g., = or ' or -- or ;
    /w*((\%27)|(\'))(\s)*((\%6F)|o|(\%4F))((\%72)|r|(\%52))/i, // e.g., ' or ' or
    /((\%27)|(\'))union/i, // e.g., ' union
    // Time-delay techniques (database dependent)
    /(waitfor\s+delay|benchmark|pg_sleep|sleep)/i, // e.g., WAITFOR DELAY
    // Other SQL keywords and commands
    /((\%27)|(\'))\s*(or|and)\s*((\%27)|(\'))/i, // e.g., ' OR '
    /(drop(\s+)?table|show(\s+)?tables|--|declare|truncate|delete|update|remove)/i, // e.g., DROP TABLE
  ];

  for (let pattern of sqlInjectionPatterns) {
    if (pattern.test(input)) {
      return true;
    }
  }
  return false;
}

export function sqlInjectionDetector(req: Request, res: Response, next: NextFunction) {
  const queryParams = Object.values(req.query);
  const bodyParams = Object.values(req.body);

  for (let param of [...queryParams, ...bodyParams]) {
    if (typeof param === 'string' && hasSQLInjection(param)) {
      return res.status(400).json({
        message: "Potential SQL Injection detected.",
      });
    }
  }
  next();
}