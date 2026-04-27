/**
 * FILE: packages/shared/src/utils/logger.ts
 * PURPOSE: Structured logging utility for Ninja Shop
 *
 * SPEC: .kiro/specs/ninja-shop/design.md
 * Requirements: 15.7
 *
 * Production: JSON structured logs to stdout
 * Development: Prefixed console logs
 */

type LogLevel = 'error' | 'warn' | 'info' | 'debug'

type LogMeta = Record<string, unknown>

function log(level: LogLevel, message: string, meta?: LogMeta): void {
  const isProduction = process.env.NODE_ENV === 'production'

  if (isProduction) {
    const entry = JSON.stringify({
      level,
      message,
      timestamp: new Date().toISOString(),
      ...meta,
    })
    if (level === 'error') {
      console.error(entry)
    } else if (level === 'warn') {
      console.warn(entry)
    } else {
      console.log(entry)
    }
  } else {
    const prefix = `[${level.toUpperCase()}]`
    if (level === 'error') {
      console.error(prefix, message, meta ?? '')
    } else if (level === 'warn') {
      console.warn(prefix, message, meta ?? '')
    } else {
      console.log(prefix, message, meta ?? '')
    }
  }
}

export const logger = {
  error: (message: string, meta?: LogMeta) => log('error', message, meta),
  warn: (message: string, meta?: LogMeta) => log('warn', message, meta),
  info: (message: string, meta?: LogMeta) => log('info', message, meta),
  debug: (message: string, meta?: LogMeta) => log('debug', message, meta),
}
