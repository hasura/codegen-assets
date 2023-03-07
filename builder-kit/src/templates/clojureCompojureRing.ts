import { html as template } from 'common-tags';

import { kebabCase } from '../utils';
import { CodegenTemplateParams } from '../types';

export const clojureCompojureRingTemplate = (params: CodegenTemplateParams) => {
  const { actionName } = params;

  return template`
    ;; This file's based on the template provided via leiningen.
    ;; use 'lein new compojure ${actionName}(<project-name>)' to create such a project
    ;; This content's of this file can directly go into 'handler.clj'

    ;; All necessary documentation can be found in these sources:
    ;; https://github.com/weavejester/compojure/wiki
    ;; https://github.com/ring-clojure/ring/wiki

    (ns ${kebabCase(actionName)}-api.handler
      (:require [compojure.core :refer :all]
                [compojure.route :as route]
                [ring.middleware.defaults :refer [wrap-defaults site-defaults]]
                [ring.middleware.json :refer [wrap-json-body wrap-json-response]]
                [ring.util.response :refer [response]]
                [clojure.string :as str]))

    ;; defining the name of the handler being used in the sample
    (def action-handler
      (symbol "${kebabCase(actionName)}-handler"))

    (defn action-handler [req]
      ;; args will contain all of the input arguments passed to the action
      (let [args (:input (:body req))]

        ;; run business logic here
      
        (response {:response args}))

    ;; Defining the allowed routes for the API
    (defroutes app-routes
      (POST "/" [] (wrap-json-response action-handler))
      (route/not-found "Route not found!"))

    ;; Defining the app
    ;; This can be executed using 'lein ring server'
    ;; and give it a spin from localhost:3000!
    (def app
      (->
        ;; This setting is not advisable for a production environment 
        (wrap-defaults app-routes (assoc-in site-defaults [:security :anti-forgery] false))
        ;; This is an optional setting
        (wrap-json-body {:keywords? true})))

  `;
};
