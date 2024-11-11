require 'zip'
require 'rubygems/package'

class RunnersController < ApplicationController

    def unsafe_zip()
        run_unsafe_unzip("../payloads/payload.zip", "../archive/")
        render json: {"message": "unpacked"} 
    end

    def run_upload_1()
        uploaded_file = params[:file]
        uploaded_file_path = Rails.root.join("tmp", uploaded_file.original_filename)

        File.open(uploaded_file_path, 'wb') do |file|
          file.write(uploaded_file.read)
        end

        begin
            run_unsafe_unzip(uploaded_file_path.to_s, "../archive/")
            File.delete(uploaded_file_path)
            render json: { "message": "Unpacked successfully" }
          rescue => e
            render json: { "message": "Error unpacking the file: #{e.message}" }, status: :internal_server_error
          end
    end

    def run_unsafe_unzip(file_name, output)
        # bad
        Zip::File.open(file_name) do |zip_file|
            zip_file.each do |entry|
            file_path = File.join(output, entry.name)
            FileUtils.mkdir_p(File.dirname(file_path))
            zip_file.extract(entry, file_path) 
            end
        end
    end



    def safe_zip()
        run_safe_unzip("../payloads/payload.zip", "../archive/")
        render json: {"message": "unpacked"} 
    end

    def run_upload_2()
        uploaded_file = params[:file]
        uploaded_file_path = Rails.root.join("tmp", uploaded_file.original_filename)

        File.open(uploaded_file_path, 'wb') do |file|
          file.write(uploaded_file.read)
        end

        begin
            run_safe_unzip(uploaded_file_path.to_s, "../archive/")
            File.delete(uploaded_file_path)
            render json: { "message": "Unpacked successfully" }
          rescue => e
            render json: { "message": "Error unpacking the file: #{e.message}" }, status: :internal_server_error
          end
    end

    def run_safe_unzip(file_name, output)
        # good
        Zip::File.open(file_name) do |zip_file|
            zip_file.each do |entry|
                safe_path = File.expand_path(entry.name, output)
        
                unless safe_path.start_with?(File.expand_path(output))
                raise "Attempted Path Traversal Detected: #{entry.name}"
                end
        
                FileUtils.mkdir_p(File.dirname(safe_path))
                zip_file.extract(entry, safe_path) 
            end
        end
    end

    def unsafe_tar()
        run_unsafe_untar("../payloads/payload.tar", "../archive/")
        render json: {"message": "unpacked"} 
    end

    def run_upload_3()
        uploaded_file = params[:file]
        uploaded_file_path = Rails.root.join("tmp", uploaded_file.original_filename)
    
        # Save the uploaded file to tmp directory
        File.open(uploaded_file_path, 'wb') do |file|
            file.write(uploaded_file.read)
        end
    
        begin
            # Call the unsafe untar method
            run_unsafe_untar(uploaded_file_path.to_s, "../archive/")
            
            # Delete the uploaded file after extraction
            File.delete(uploaded_file_path)
            
            render json: { "message": "Unpacked successfully" }
        rescue => e
            render json: { "message": "Error unpacking the file: #{e.message}" }, status: :internal_server_error
        end
    end
    
    def run_unsafe_untar(file_name, output)
        # bad
        file_stream = IO.new(IO.sysopen(file_name))
        tarfile = Gem::Package::TarReader.new(file_stream)
        tarfile.each do |entry|
            entry_var = entry.full_name
      
            File.open(entry_var, "wb") do |f|
                f.write(entry.read)
            end 
        end
    end

    def safe_tar()
        run_safe_untar("../payloads/payload.tar", "../archive/")
        render json: {"message": "unpacked"} 
    end

    def run_upload_safe_4()
        uploaded_file = params[:file]
        uploaded_file_path = Rails.root.join("tmp", uploaded_file.original_filename)
    
        # Save the uploaded file to tmp directory
        File.open(uploaded_file_path, 'wb') do |file|
            file.write(uploaded_file.read)
        end
    
        begin
            # Call the safe untar method
            run_safe_untar(uploaded_file_path.to_s, "../archive/")
            
            # Delete the uploaded file after extraction
            File.delete(uploaded_file_path)
            
            render json: { "message": "Unpacked successfully" }
        rescue => e
            render json: { "message": "Error unpacking the file: #{e.message}" }, status: :internal_server_error
        end
    end

    def run_safe_untar(file_name, output)
        # bad
        File.open(file_name, "rb") do |file_stream|
          Gem::Package::TarReader.new(file_stream).each do |entry|
            entry_var = entry.full_name
            safe_path = File.expand_path(entry_var, output)
      
            unless safe_path.start_with?(File.expand_path(output))
              raise "Attempted Path Traversal Detected: #{entry_var}"
            end
      
            File.open(safe_path, "wb") do |f|
              f.write(entry.read)
            end
          end
        end
    end

    def unsafe_targz()
        run_unsafe_untargz("../payloads/payload.tar.gz", "../archive/")
        render json: {"message": "unpacked"} 
    end

    def run_upload_5()
        uploaded_file = params[:file]
        uploaded_file_path = Rails.root.join("tmp", uploaded_file.original_filename)
    
        # Save the uploaded file to tmp directory
        File.open(uploaded_file_path, 'wb') do |file|
            file.write(uploaded_file.read)
        end
    
        begin
            # Call the unsafe untargz method
            run_unsafe_untargz(uploaded_file_path.to_s, "../archive/")
            
            # Delete the uploaded file after extraction
            File.delete(uploaded_file_path)
            
            render json: { "message": "Unpacked successfully" }
        rescue => e
            render json: { "message": "Error unpacking the file: #{e.message}" }, status: :internal_server_error
        end
    end
    

    def run_unsafe_untargz(file_name, output)
        # bad
        Zlib::GzipReader.open(file_name) do |gz|
            tarfile = Gem::Package::TarReader.new(gz)
            tarfile.each do |entry|
                entry_var = entry.full_name
                File.open(entry_var, "wb") do |file|
                    file.write(entry.read)
                end
            end
        end
    end

    def safe_targz()
        run_safe_untargz("../payloads/payload.tar.gz", "../archive/")
        render json: {"message": "unpacked"} 
    end

    def run_upload_6()
        uploaded_file = params[:file]
        uploaded_file_path = Rails.root.join("tmp", uploaded_file.original_filename)
    
        # Save the uploaded file to tmp directory
        File.open(uploaded_file_path, 'wb') do |file|
            file.write(uploaded_file.read)
        end
    
        begin
            # Call the safe untargz method
            run_safe_untargz(uploaded_file_path.to_s, "../archive/")
            
            # Delete the uploaded file after extraction
            File.delete(uploaded_file_path)
            
            render json: { "message": "Unpacked successfully" }
        rescue => e
            render json: { "message": "Error unpacking the file: #{e.message}" }, status: :internal_server_error
        end
    end
    

    def run_safe_untargz(file_name, output)
        # good
        Zlib::GzipReader.open(file_name) do |gz|
            tarfile = Gem::Package::TarReader.new(gz)
            tarfile.each do |entry|
                entry_var = entry.full_name
        
                safe_path = File.expand_path(entry_var, output)
        
                unless safe_path.start_with?(File.expand_path(output))
                    raise "Attempted Path Traversal Detected: #{entry_var}"
                end
        
                File.open(safe_path, "wb") do |file|
                    file.write(entry.read)
                end
            end
        end
    end
end
