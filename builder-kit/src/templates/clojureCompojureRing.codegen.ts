import { clojureCompojureRingTemplate } from './clojureCompojureRing';
import { buildActionTypes } from '../schemaTools';
import { DeriveParams } from '../types';

const templater = (
  actionName: string,
  actionSdl: string,
  derive: DeriveParams | null
) => {
  const actionParams = buildActionTypes(actionName, actionSdl);
  const codegen = clojureCompojureRingTemplate({ ...actionParams, derive });
  const response = [
    {
      name: `${actionName}-handler.clj`,
      content: codegen,
    }
  ];

  return response;
}

globalThis.templater = templater;
