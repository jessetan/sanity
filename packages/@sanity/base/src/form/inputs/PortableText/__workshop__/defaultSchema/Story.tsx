import {Card, Container, Flex, LayerProvider} from '@sanity/ui'
import {useBoolean, useSelect} from '@sanity/ui-workshop'
import React from 'react'
import {createConfig} from '../../../../../config'
// import {createSchema} from '../../../../../schema'
import {StudioProvider} from '../../../../../studio'
import {FIXME} from '../../../../types'
import {TestInput} from '../_common/TestInput'
import {values, valueOptions} from './values'

const ptType = {
  type: 'array',
  name: 'body',
  of: [{type: 'block'}],
}

// export const schema = createSchema({
//   name: 'default',
//   types: [ptType],
// })

const config = createConfig({
  name: 'test',
  dataset: 'test',
  projectId: 'test',
  schema: {
    types: [ptType],
  },
})

export default function Story() {
  const readOnly = useBoolean('Read only', false)
  const withError = useBoolean('With error', false)
  const withWarning = useBoolean('With warning', false)
  const selectedValue = useSelect('Values', valueOptions) || 'empty'
  const value = values[selectedValue]

  const type = schema.get('body')

  return (
    <StudioProvider>
      <Card height="fill" padding={4} sizing="border">
        <Flex align="center" height="fill" justify="center">
          <Container width={1}>
            <TestInput
              readOnly={readOnly}
              schema={schema}
              type={type as FIXME}
              value={value}
              withError={withError}
              withWarning={withWarning}
            />
          </Container>
        </Flex>
      </Card>
    </StudioProvider>
  )
}
