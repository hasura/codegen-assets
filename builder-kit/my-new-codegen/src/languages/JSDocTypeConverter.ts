import { TypeConverter, BaseTypeConverterConfig } from './BaseTypeConverter'
import { LanguageTypeConverterConfig, ScalarTypes } from '../types'
import { NEWLINE } from '../utils'
import { html as template } from 'common-tags'

export class JSDocTypeConverter extends TypeConverter {
  constructor(config: LanguageTypeConverterConfig) {
    const scalarMap = {
      [ScalarTypes.ID]: `number`,
      [ScalarTypes.INT]: `number`,
      [ScalarTypes.FLOAT]: `number`,
      [ScalarTypes.STRING]: `string`,
      [ScalarTypes.BOOLEAN]: `boolean`,
    }

    const baseConfig: BaseTypeConverterConfig = {
      isAction: config.isAction ?? true,
      schema: config.schema,
      scalarMap,
      typeClassIdentifier: (name) => template`
      /** 
        * @typedef {Object} ${name}
        * `,
      typeDelimiters: ['', `${NEWLINE} **/`],
      fieldDelimiter: NEWLINE + '  *',
      fieldFormatter: (name, typeNode, nullable) => {
        let { required, list, type } = typeNode
        if (!required) name = `[${name}]`
        if (list) type = `Array<${type}>`
        return `@property {${type}} ${name}`
      },
    }
    super(baseConfig)
  }
}
