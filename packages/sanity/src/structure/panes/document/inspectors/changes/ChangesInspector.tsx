import {type ObjectDiff} from '@sanity/diff'
import {AvatarStack, BoundaryElementProvider, Box, Card, Flex} from '@sanity/ui'
import {type ReactElement, useMemo, useRef} from 'react'
import {
  ChangeFieldWrapper,
  ChangeList,
  DiffTooltip,
  type DocumentChangeContextInstance,
  type DocumentInspectorProps,
  LoadingBlock,
  NoChanges,
  type ObjectSchemaType,
  ScrollContainer,
  UserAvatar,
  useTimelineSelector,
  useTranslation,
} from 'sanity'
import {DocumentChangeContext} from 'sanity/_singletons'
import {styled} from 'styled-components'

import {DocumentInspectorHeader} from '../../documentInspector'
import {TimelineMenu} from '../../timeline'
import {useDocumentPane} from '../../useDocumentPane'
import {collectLatestAuthorAnnotations} from './helpers'

const Scroller = styled(ScrollContainer)`
  height: 100%;
  overflow: auto;
  position: relative;
  scroll-behavior: smooth;
`

export function ChangesInspector(props: DocumentInspectorProps): ReactElement {
  const {onClose} = props
  const {documentId, schemaType, timelineError, timelineStore, value} = useDocumentPane()
  const scrollRef = useRef<HTMLDivElement | null>(null)

  // Subscribe to external timeline state changes
  const diff = useTimelineSelector(timelineStore, (state) => state.diff)
  const onOlderRevision = useTimelineSelector(timelineStore, (state) => state.onOlderRevision)
  const selectionState = useTimelineSelector(timelineStore, (state) => state.selectionState)
  const sinceTime = useTimelineSelector(timelineStore, (state) => state.sinceTime)
  const loading = selectionState === 'loading'
  const isComparingCurrent = !onOlderRevision

  // Note that we are using the studio core namespace here, as changes theoretically should
  // be part of Sanity core (needs to be moved from structure at some point)
  const {t} = useTranslation('studio')

  const documentContext: DocumentChangeContextInstance = useMemo(
    () => ({
      documentId,
      schemaType,
      FieldWrapper: ChangeFieldWrapper,
      rootDiff: diff,
      isComparingCurrent,
      value,
      showFromValue: true,
    }),
    [documentId, diff, isComparingCurrent, schemaType, value],
  )

  const changeAnnotations = useMemo(
    () => (diff ? collectLatestAuthorAnnotations(diff) : []),
    [diff],
  )

  return (
    <Flex data-testid="review-changes-pane" direction="column" height="fill" overflow="hidden">
      <DocumentInspectorHeader
        as="header"
        closeButtonLabel={t('changes.action.close-label')}
        flex="none"
        onClose={onClose}
        title={t('changes.title')}
      >
        <Flex gap={1} padding={3} paddingTop={0} paddingBottom={2}>
          <Box flex={1}>
            <TimelineMenu mode="since" chunk={sinceTime} placement="bottom-start" />
          </Box>

          <Box flex="none">
            <DiffTooltip
              annotations={changeAnnotations}
              description={t('changes.changes-by-author')}
              portal
            >
              <AvatarStack maxLength={4} aria-label={t('changes.changes-by-author')}>
                {changeAnnotations.map(({author}) => (
                  <UserAvatar key={author} user={author} />
                ))}
              </AvatarStack>
            </DiffTooltip>
          </Box>
        </Flex>
      </DocumentInspectorHeader>

      <Card flex={1}>
        <BoundaryElementProvider element={scrollRef.current}>
          <Scroller data-ui="Scroller" ref={scrollRef}>
            <Box flex={1} padding={4}>
              <Content
                diff={diff}
                documentContext={documentContext}
                error={timelineError}
                loading={loading}
                schemaType={schemaType}
              />
            </Box>
          </Scroller>
        </BoundaryElementProvider>
      </Card>
    </Flex>
  )
}

function Content({
  error,
  diff,
  documentContext,
  loading,
  schemaType,
}: {
  error?: Error | null
  diff: ObjectDiff<any> | null
  documentContext: DocumentChangeContextInstance
  loading: boolean
  schemaType: ObjectSchemaType
}) {
  if (error) {
    return <NoChanges />
  }

  if (loading) {
    return <LoadingBlock showText />
  }

  if (!diff) {
    return <NoChanges />
  }

  return (
    <DocumentChangeContext.Provider value={documentContext}>
      <ChangeList diff={diff} schemaType={schemaType} />
    </DocumentChangeContext.Provider>
  )
}
