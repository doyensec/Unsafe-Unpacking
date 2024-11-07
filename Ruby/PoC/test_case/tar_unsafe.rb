require 'rubygems/package'
require 'fileutils'

def untar1(file_name, output)
  # bad
  file_stream = IO.new(IO.sysopen(file_name))
  tarfile = Gem::Package::TarReader.new(file_stream)
  tarfile.each do |entry|
    entry_var = entry.full_name
    # ruleid: unsafe_tar_unpacking
    ::File.open(output+ "/" + entry.full_name, "wb") 
  end
end  

def untar2(file_name, output)
  # bad
  File.open(file_name, 'rb') do |file_stream|
    Gem::Package::TarReader.new(file_stream).each do |entry|
      # ruleid: unsafe_tar_unpacking
      ::File.open(output+ "/" + entry.full_name, "wb")
    end
  end
end  

def untar3(file_name, output)
  # bad
  File.open(file_name, 'rb') do |file|
    tar_reader = Gem::Package::TarReader.new(file)
    tar_reader.each_entry do |entry|
      entry_path = File.join(output, entry.full_name)
      FileUtils.mkdir_p(File.dirname(entry_path))
      # ruleid: unsafe_tar_unpacking
      File.open(entry_path, 'wb') 
    end
  end
end

def untar4(tar_file_path, output_dir)
  # bad
  File.open(tar_file_path, 'rb') do |file|
    tar_reader = Gem::Package::TarReader.new(file)
    # Use seek to find and yield the specific entry
    tar_reader.seek("../secret.txt") do |entry|
      entry_path = File.join(output_dir, entry.full_name)
      
      # ruleid: unsafe_tar_unpacking
      File.open(entry_path, 'wb')
    end
  end
end

def untar5(file_name, output)
  # good
  file_stream = IO.new(IO.sysopen(file_name))
  tarfile = Gem::Package::TarReader.new(file_stream)
  tarfile.each do |entry|
    entry_var = entry.full_name
    safe_path = File.expand_path(entry_var, output)

    unless safe_path.start_with?(File.expand_path(output))
      raise "Attempted Path Traversal Detected: #{entry_var}"
    end

    ::File.open(safe_path, "a") 
  end
end  

def untar6(file_name, output)
  # good
  File.open(file_name, 'rb') do |file_stream|
    Gem::Package::TarReader.new(file_stream).each do |entry|
      entry_var = entry.full_name
      safe_path = File.join(output, entry_var)

      unless safe_path.start_with?(File.expand_path(output))
        raise "Attempted Path Traversal Detected: #{entry_var}"
      end

      # ok: unsafe_tar_unpacking
      File.open(safe_path, 'wb') do |f|
        f.write(entry.read)
      end
    end
  end
end  

def untar7(file_name, output)
  # good
  file_stream = IO.new(IO.sysopen(file_name))
  tarfile = Gem::Package::TarReader.new(file_stream)
  tarfile.each do |entry|
    entry_var = File.basename(entry.full_name)
    # ok: unsafe_tar_unpacking
    File.open(output+ "/" + entry_var, "wb")  do |f|
      f.write(entry.read)
    end
  end
end  

def untar8(file_name, output)
  # bad
  file_stream = IO.new(IO.sysopen(file_name))
  tarfile = Gem::Package::TarReader.new(file_stream)
  tarfile.each do |entry|
    entry_var = entry.full_name
    unsafe_path = File.expand_path(entry_var, output)

    ::File.open(unsafe_path, "a") 
  end
end 

untar8("/Users/michael/Doyensec/Research/SemgrepSlip/Ruby/PoC/payloads/payload.tar", "/Users/michael/Doyensec/Research/SemgrepSlip/Ruby/PoC/test_case")