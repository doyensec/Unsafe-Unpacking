
require 'zip'
 
def unzip1(file_name, output)
  # bad
  Zip::File.open(file_name) do |zip_file|
    zip_file.each do |entry|
      file_path = File.join(output, entry.name)
      FileUtils.mkdir_p(File.dirname(file_path))
      zip_file.extract(entry, file_path) 
    end
  end
end

def unzip2(file_name, output)
# Creates the Zip object 
  zip_file = Zip::File.open(file_name)
  zip_file.each do |entry|
    file_path = File.join(output, entry.name)
    FileUtils.mkdir_p(File.dirname(file_path))
    zip_file.extract(entry, file_path) 
  end
end

def unzip3(file_name, output)
  zip_file = Zip::File.new(file_name)

  zip_file.each do |entry|
    file_path = File.join(output, entry.name)
    FileUtils.mkdir_p(File.dirname(file_path)) 
    zip_file.extract(entry, file_path) 
  end
end

def unzip4(file_name, output)
  zip_file = Zip::File.new(file_name)

  zip_file.each do |entry|
    entry_name = entry.name
    file_path = File.join(output, entry_name)
    FileUtils.mkdir_p(File.dirname(file_path)) 
    zip_file.extract(entry, file_path) 
  end
end


def unzip5(file_name, output)
  Zip::File.open(file_name) do |zip_file|
    zip_file.each_with_object([]) do |entry, _|
      file_path = File.join(output, entry.name)
      FileUtils.mkdir_p(File.dirname(file_path))
      zip_file.extract(entry, file_path)
    end
  end
end

def unzip6(file_name, output)
  Zip::File.foreach(file_name) do |entry|
    entry.extract(output+"/#{entry.name}")
  end
end

def unzip7(file_name, output)
  zip_data = File.binread(file_name)
  Zip::File.open_buffer(zip_data) do |zip_file|
    zip_file.each do |entry|
      file_path = File.join(output, entry.name)
      FileUtils.mkdir_p(File.dirname(file_path)) 
      zip_file.extract(entry, file_path)  
    end
  end
end

def unzip8(file_name, output)
  entry_name = "../poc.txt"
  Zip::File.open(file_name) do |zip_file|
    entry = zip_file.get_entry(entry_name)
    file_path = File.join(output, entry.name)
    FileUtils.mkdir_p(File.dirname(file_path))  
    zip_file.extract(entry, file_path)  
  end
end

def unzip9(file_name, output)
  entry_name = "../poc.txt"
  Zip::File.open(file_name) do |zip_file|
    entry = zip_file.find_entry(entry_name)
    file_path = File.join(output, entry.name)
    FileUtils.mkdir_p(File.dirname(file_path))  
    zip_file.extract(entry, file_path)  
  end
end

def unzip10(file_name, output)
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

def unzip11(file_name, output)
  # good
  Zip::File.open(file_name) do |zip_file|
    zip_file.each do |entry|
      file_path = File.join(output, File.basename(entry.name))
      FileUtils.mkdir_p(File.dirname(file_path))
      zip_file.extract(entry, file_path) 
    end
  end
end

zip_file_path = '../payloads/payload.zip'
destination_folder = '../test_case/'
 
unzip1(zip_file_path, destination_folder)