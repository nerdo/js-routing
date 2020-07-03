// types patterned after https://github.com/jest-community/jest-extended/blob/master/types/index.d.ts

/// <reference types="jest" />

import { objectExclusivelyContaining } from './objectExclusivelyContaining'

declare global {
    namespace jest {
        interface Expect {
            objectExclusivelyContaining(expected: unknown): CustomMatcherResult
        }
    }
}

expect.extend({ objectExclusivelyContaining })
