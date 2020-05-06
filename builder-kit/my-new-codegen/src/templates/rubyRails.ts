import { snakeCase } from '../utils'
import { html as template } from 'common-tags'
import { CodegenTemplateParams } from '../types'

export const rubyRailsTemplate = (params: CodegenTemplateParams) => {
  const { actionName } = params

  let baseTemplate: string = template`
    begin
      require "bundler/inline"
    rescue LoadError => e
      $stderr.puts "Bundler version 1.10 or later is required. Please update your Bundler"
      raise e
    end

    gemfile(true) do
      source "https://rubygems.org"
      gem 'rails', '~> 6.0.0'
    end

    require "action_controller/railtie"

    class App < Rails::Application
      routes.append do
        post "/${actionName}" => "hasura#${snakeCase(actionName)}_handler"
      end

      config.consider_all_requests_local = true # display errors
    end

    class HasuraController < ActionController::API
      def ${snakeCase(actionName)}_handler
        request_data = params[:input]
        puts request_data
        render json: request_data
      end
    end

    App.initialize!
    Rack::Server.new(app: App, Port: 3000).start
  `

  return baseTemplate
}
