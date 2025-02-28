import {type ObjectSchemaType} from '@sanity/types'
import {Box, Card} from '@sanity/ui'
import {useCallback, useMemo} from 'react'
import {DocumentChangeContext} from 'sanity/_singletons'

import {useSchema} from '../../hooks'
import {ChangeResolver, type DocumentChangeContextInstance} from '../diff'
import {type FieldChangeNode, type ObjectDiff, type StringDiff} from '../types'

export default function ChangeResolverStory() {
  const documentId = 'test'
  const documentType = 'author'
  const schema = useSchema()
  const schemaType = schema.get(documentType) as ObjectSchemaType

  const nameDiff: StringDiff = useMemo(
    () => ({
      type: 'string',
      action: 'changed',
      isChanged: true,
      fromValue: '',
      toValue: 'Test',
      annotation: {
        chunk: {
          index: 0,
          id: 'foo',
          type: 'editDraft',
          start: 0,
          end: 0,
          startTimestamp: new Date('2021-01-01').toJSON(),
          endTimestamp: new Date('2021-01-02').toJSON(),
          authors: new Set(['p27ewL8aM']),
          draftState: 'present',
          publishedState: 'missing',
        },
        timestamp: new Date('2021-01-02').toJSON(),
        author: 'p27ewL8aM',
      },
      segments: [],
    }),
    [],
  )

  const change: FieldChangeNode = useMemo(
    () => ({
      type: 'field',
      diff: nameDiff,
      key: 'name',
      path: ['name'],
      parentSchema: schemaType,
      schemaType: schemaType.fields.find((f) => f.name === 'name') as any,
      titlePath: ['Name'],
      showIndex: true,
      showHeader: true,
    }),
    [nameDiff, schemaType],
  )

  const FieldWrapper = useCallback((_props: any) => {
    // console.log('props', _props)
    return <Card>{_props.children}</Card>
  }, [])

  const diff: ObjectDiff = useMemo(
    () => ({
      type: 'object',
      action: 'changed',
      isChanged: true,
      fields: {
        name: nameDiff,
      },
      fromValue: {
        name: '',
      },
      toValue: {
        name: 'Test',
      },
      annotation: {
        chunk: {
          index: 0,
          id: 'foo',
          type: 'editDraft',
          start: 0,
          end: 0,
          startTimestamp: new Date('2021-01-01').toJSON(),
          endTimestamp: new Date('2021-01-02').toJSON(),
          authors: new Set(['p27ewL8aM']),
          draftState: 'present',
          publishedState: 'missing',
        },
        timestamp: new Date('2021-01-02').toJSON(),
        author: 'p27ewL8aM',
      },
    }),
    [nameDiff],
  )

  const documentContext: DocumentChangeContextInstance = useMemo(
    () => ({
      documentId,
      FieldWrapper,
      isComparingCurrent: true,
      rootDiff: diff,
      schemaType,
      value: {name: 'Test'},
      showFromValue: true,
    }),
    [diff, documentId, FieldWrapper, schemaType],
  )

  return (
    <Box padding={4}>
      <DocumentChangeContext.Provider value={documentContext}>
        <ChangeResolver change={change} />
      </DocumentChangeContext.Provider>
    </Box>
  )
}
