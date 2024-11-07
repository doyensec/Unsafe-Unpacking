require 'rubygems/package'
require 'zlib'

def untargz(file_name, output)
  # bad
  Zlib::GzipReader.open(file_name) do |gz|
    tarfile = Gem::Package::TarReader.new(gz)
    tarfile.each do |entry|
      entry_var = entry.full_name
      File.open(entry_var, 'wb') do |file|
        file.write(entry.read)
      end
    end
  end
end

def untargz2(file_name, output)
  # good
  Zlib::GzipReader.open(file_name) do |gz|
    tarfile = Gem::Package::TarReader.new(gz)
    tarfile.each do |entry|
      entry_var = entry.full_name

      safe_path = File.expand_path(entry_var, output)

      unless safe_path.start_with?(File.expand_path(output))
        raise "Attempted Path Traversal Detected: #{entry_var}"
      end

      File.open(safe_path, 'wb') do |file|
        file.write(entry.read)
      end
    end
  end
end

untargz2("/Users/michael/Doyensec/Research/SemgrepSlip/Ruby/PoC/payloads/payload.tar.gz", "/Users/michael/Doyensec/Research/SemgrepSlip/Ruby/PoC/test_case")