import { TypeConverter } from './BaseTypeConverter'
import { LanguageTypeConverterConfig, ScalarTypes } from '../types'
import { BaseTypeConverterConfig } from './BaseTypeConverter'
import { NEWLINE, indent } from '../utils'
import { html as template } from 'common-tags'
import VerEx from 'verbal-expressions'

export class PythonTypeConverter extends TypeConverter {
  constructor(config: LanguageTypeConverterConfig) {
    const pythonScalarMap = {
      [ScalarTypes.ID]: `int`,
      [ScalarTypes.INT]: `int`,
      [ScalarTypes.FLOAT]: `float`,
      [ScalarTypes.STRING]: `str`,
      [ScalarTypes.BOOLEAN]: `bool`,
    }

    /**
     * VerbalExpressions match for attributes like the "int" and "another" lines below
     * @dataclass
     * class MyClass:
     *   something: int
     *   another: Optional[List[str]]
     */
    // prettier-ignore
    const classAttributeRegex =
      VerEx().lineBreak().whitespace().oneOrMore()
        .word(/* my_attribute */).then(':').whitespace().word().maybe('[')
            .maybe(VerEx().word(/* Optional[List[str]] */))
        .maybe(']')
        .maybe(" = None")

    /**
     * VerbalExpressions match for entire Mutation/Query Dataclass
     * @dataclass
     * class Mutation:
     *   MyHasuraAction: Optional[MyType]
     */
    // prettier-ignore
    const mutationOrQueryDataClassRegex =
      VerEx().find('@dataclass').lineBreak()
        .then('class ').maybe('Mutation:').maybe('Query:')
        .then(classAttributeRegex).oneOrMore()

    const baseConfig: BaseTypeConverterConfig = {
      isAction: config.isAction ?? true,
      schema: config.schema,
      scalarMap: pythonScalarMap,
      prepend:
        template`
        from dataclasses import dataclass
        from typing import List, Optional
        from enum import Enum, auto
      ` + NEWLINE,
      typeConversionConfig: {
        classIdentifier: (name) => template`
          @dataclass
          class ${name}:`,
        typeDelimiters: [NEWLINE, NEWLINE],
        fieldDelimiter: indent(NEWLINE),
        fieldFormatter: (name, typeNode, nullable) => {
          let { list, type } = typeNode
          // str -> List[str]
          if (list) type = `List[${type}]`
          // List[str] -> Optional[List[str]]
          if (nullable) type = `Optional[${type}]`
          // usernames: Optional[List[str]]
          return `${name}: ${type}`
        },
      },
      // from enum import Enum, auto
      // class Color(Enum):
      //   RED = auto()
      //   BLUE = auto()
      //   GREEN = auto()
      enumConverionConfig: {
        classIdentifier: (name) => template`
          class ${name}(Enum):`,
        typeDelimiters: [NEWLINE, NEWLINE],
        fieldDelimiter: indent(NEWLINE),
        valueFormatter: (node) => indent(`${node.value} = auto()`),
      },
      // Python disallows referencing variables before declaration
      // Which means the Dataclasses need to be in order, so Mutation/Query needs to go last
      postFormat: (typeDefs) => {
        const match = mutationOrQueryDataClassRegex.exec(typeDefs)
        // If found, replace the definition at the top with empty string, then append to end
        if (match) {
          const [dataClassText] = match
          typeDefs = typeDefs.replace(dataClassText, '') + dataClassText
        }
        return typeDefs
      },
    }

    super(baseConfig)
  }
}
