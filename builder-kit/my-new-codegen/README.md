# Contributing to Hasura codegen

Each codegen has two parts:

1. Language type convertor: Type convertors are used to convert the GraphQL types from GraphQL SDL to the types/documentation of a particular language. [Check out the example type convertor for TypeScript](https://github.com/hasura/codegen-assets/tree/master/source/src/languages-functional/typescript.ts).
2. Template: Templates accept the `action name`, `actionsSdl` and some more metadata and return the generated code for an action handler in a particular language/framework. [Check out the template for typescript-express](https://github.com/hasura/codegen-assets/tree/master/source/src/templates/typescriptExpress.ts)

You can contribute to codegen in one or more of the following ways:

### Creating a type convertor for a new language

We have type convertors for a bunch of languages [here](https://github.com/hasura/codegen-assets/tree/master/source/src/languages-functional). You can add a type convertor for a new language that can be levaraged in future to add codegen for different framworks/runtimes for that language.

TODO (elaborate instructions)

### Creating a templates for a framework

We have a templaters for different frameworks and runtimes [here](https://github.com/hasura/codegen-assets/tree/master/source/src/templates).

TODO (elaborate instructions)

### Bugs and improvements to existing assets

If you see some bugs in the codegen or if you feel that something could be done better, please [open an issue] about it. If you wish to work on a particular bug/enhancement, please comment on the issue and we will assign you accordingly.

> If you are working on an issue or wanting to work on an issue, please make sure that you are on the same page with the maintainers about it. This is to avoid duplicate or unnecessary work.

