import {cloneDeep} from 'lodash'
import {expect, test} from 'vitest'

import {type Doc} from '../src/document/types'
import {Patcher} from '../src/patch'
// Test suites
import diffMatchPatch from './patchExamples/diffMatchPatch'
import incDec from './patchExamples/incDec'
import insert from './patchExamples/insert'
import mixed from './patchExamples/mixed'
import set from './patchExamples/set'
import setIfMissing from './patchExamples/setIfMissing'
import unset from './patchExamples/unset'

const examples = [
  ...set,
  ...setIfMissing,
  ...unset,
  ...diffMatchPatch,
  ...insert,
  ...incDec,
  ...mixed,
]

examples.forEach((example) => {
  test(example.name, () => {
    // Fake some id's in there
    example.before._id = 'a'
    if (Array.isArray(example.patch)) {
      example.patch.forEach((patch) => {
        patch.id = 'a'
      })
    } else {
      example.patch.id = 'a'
    }

    const patcher = new Patcher(example.patch)
    const pristine = cloneDeep(example.before)
    const patched = patcher.apply(example.before as Doc) as Record<string, unknown>

    // Don't care about ids in result
    delete patched._id
    delete pristine._id
    delete example.before._id

    // Verify patch
    expect(patched).toEqual(example.after)
    // Verify immutability
    expect(pristine).toEqual(example.before)
  })
})
