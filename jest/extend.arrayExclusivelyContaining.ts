// types patterned after https://github.com/jest-community/jest-extended/blob/master/types/index.d.ts

/// <reference types="jest" />

import { arrayExclusivelyContaining } from './arrayExclusivelyContaining'

declare global {
  namespace jest {
    interface Expect {
      arrayExclusivelyContaining(expected: Array<unknown>): CustomMatcherResult
    }
  }
}

expect.extend({ arrayExclusivelyContaining })
