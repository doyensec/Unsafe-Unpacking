class SourcesController < ApplicationController
    def source_1
        render json: { code: '''def unsafe_unzip(file_name, output)
  # bad
  Zip::File.open(file_name) do |zip_file|
    zip_file.each do |entry|
      file_path = File.join(output, entry.name)
      FileUtils.mkdir_p(File.dirname(file_path))
      zip_file.extract(entry, file_path) 
    end
  end
end'''}
    end

    def source_2
        render json: { code: '''def safe_unzip(file_name, output)
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
end'''}
    end

    def source_3
        render json: { code: '''def unsafe_untar(file_name, output)
  # bad
  file_stream = IO.new(IO.sysopen(file_name))
  tarfile = Gem::Package::TarReader.new(file_stream)
  tarfile.each do |entry|
    entry_var = entry.full_name

    File.open(entry_var, "wb") do |f|
        f.write(entry.read)
    end 
  end
end'''}
    end

    def source_4
        render json: { code: '''def unsafe_untar(file_name, output)
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
end'''}
    end

    def source_5
        render json: { code: '''def untargz(file_name, output)
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
end  '''}
    end

    def source_6
        render json: { code: '''def untargz2(file_name, output)
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
end'''}
    end
end
