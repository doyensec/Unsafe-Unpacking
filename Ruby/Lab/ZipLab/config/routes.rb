Rails.application.routes.draw do
  root "lab#index"
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  get 'source_1', to: 'sources#source_1'
  get 'source_2', to: 'sources#source_2'
  get 'source_3', to: 'sources#source_3'
  get 'source_4', to: 'sources#source_4'
  get 'source_5', to: 'sources#source_5'
  get 'source_6', to: 'sources#source_6'

  get 'run_unsafe_zip', to: 'runners#unsafe_zip'
  get 'run_safe_zip', to: 'runners#safe_zip'
  get 'run_unsafe_tar', to: 'runners#unsafe_tar'
  get 'run_safe_tar', to: 'runners#safe_tar'
  get 'run_unsafe_targz', to: 'runners#unsafe_targz'
  get 'run_safe_targz', to: 'runners#safe_targz'

  get 'directory', to: 'directory#directory'
  get 'clear_directory', to: 'directory#clear_directory'

  post 'upload_1', to: 'runners#run_upload_1'
  post 'upload_2', to: 'runners#run_upload_2'
  post 'upload_3', to: 'runners#run_upload_3'
  post 'upload_4', to: 'runners#run_upload_4'
  post 'upload_5', to: 'runners#run_upload_5'
  post 'upload_6', to: 'runners#run_upload_6'



  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  # get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/*
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest

  # Defines the root path route ("/")
  # root "posts#index"
end
