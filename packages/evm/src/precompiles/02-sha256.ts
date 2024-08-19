import { bytesToHex } from '@ethereumjs/util'
import { sha256 } from 'ethereum-cryptography/sha256.js'

import { OOGResult } from '../evm.js'

import { gasLimitCheck } from './util.js'

import type { ExecResult } from '../types.js'
import type { PrecompileInput } from './types.js'

export function precompile02(opts: PrecompileInput): ExecResult {
  const data = opts.data
  const sha256Function = opts.common.customCrypto.sha256 ?? sha256
  let gasUsed = opts.common.param('sha256Gas')
  gasUsed += opts.common.param('sha256WordGas') * BigInt(Math.ceil(data.length / 32))

  if (!gasLimitCheck(opts, gasUsed, 'KECCAK256 (0x02)')) {
    return OOGResult(opts.gasLimit)
  }

  const hash = sha256Function(data)
  if (opts._debug !== undefined) {
    opts._debug(`KECCAK256 (0x02) return hash=${bytesToHex(hash)}`)
  }

  return {
    executionGasUsed: gasUsed,
    returnValue: hash,
  }
}
