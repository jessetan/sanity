import {ArrowLeftIcon} from '@sanity/icons'
import {Button} from '@sanity/ui'
import React, {memo, useMemo} from 'react'
import {GeneralPreviewLayoutKey} from '../../../components/previews'
import {InitialValueTemplateItem} from '../../../templates'
import {PaneMenuItem, PaneMenuItemGroup, DeskToolPaneActionHandler} from '../../types'
import {BackLink, PaneHeader, PaneHeaderActions, useDeskTool} from '../../components'
import {SortOrder} from './types'

interface DocumentListPaneHeaderProps {
  index: number
  initialValueTemplates?: InitialValueTemplateItem[]
  menuItems?: PaneMenuItem[]
  menuItemGroups?: PaneMenuItemGroup[]
  setLayout: (layout: GeneralPreviewLayoutKey) => void
  setSortOrder: (sortOrder: SortOrder) => void
  title: string
}

export const DocumentListPaneHeader = memo(
  ({
    index,
    initialValueTemplates = [],
    menuItems = [],
    menuItemGroups = [],
    setLayout,
    setSortOrder,
    title,
  }: DocumentListPaneHeaderProps) => {
    const {features} = useDeskTool()

    const actionHandlers = useMemo((): Record<string, DeskToolPaneActionHandler> => {
      return {
        setLayout: ({layout: value}: {layout: GeneralPreviewLayoutKey}) => {
          setLayout(value)
        },
        setSortOrder: (sort: SortOrder) => {
          setSortOrder(sort)
        },
      }
    }, [setLayout, setSortOrder])

    return (
      <PaneHeader
        backButton={
          features.backButton &&
          index > 0 && <Button as={BackLink} data-as="a" icon={ArrowLeftIcon} mode="bleed" />
        }
        title={title}
        actions={
          <PaneHeaderActions
            initialValueTemplateItems={initialValueTemplates}
            actionHandlers={actionHandlers}
            menuItemGroups={menuItemGroups}
            menuItems={menuItems}
          />
        }
      />
    )
  }
)

DocumentListPaneHeader.displayName = 'DocumentListPaneHeader'
