# Ruby Decompression Attacks

## Introduction

The decompression libraries analyzed for Ruby were the `zip` and the `TarReader` gems.

## Unsafe Usages

### [zip](https://rubygems.org/gems/zip/) 

```rb
Zip::File.open(file_name).extract(entry, file_path)
```

The `extract()` method in Ruby's `zip` library is used to extract an entry from the archive to the `file_path` directory. This method is unsafe since it doesn't remove redundant dots and separators:

```rb
# Extracts `entry` to a file at `entry_path`, with `destination_directory`
# as the base location in the filesystem.
#
# NB: The caller is responsible for making sure `destination_directory` is
# safe, if it is passed.
def extract(entry, entry_path = nil, destination_directory: '.', &block)
    block ||= proc { ::Zip.on_exists_proc }
    found_entry = get_entry(entry)
    entry_path ||= found_entry.name
    found_entry.extract(entry_path, destination_directory: destination_directory, &block)
end
```

As the comment suggests, it's the caller the responsible for making sure that `destination_directory` is safe.

An example of vulnerable code would be the following:

```rb
def unsafe_unzip(file_name, output)
  # bad
  Zip::File.open(file_name) do |zip_file|
    zip_file.each do |entry|
      file_path = File.join(output, entry.name)
      FileUtils.mkdir_p(File.dirname(file_path))
      zip_file.extract(entry, file_path) 
    end
  end
end
```

### [TarReader](https://docs.ruby-lang.org/en/3.1/Gem/Package/TarReader.html)

```rb
Gem::Package::TarReader.new(file)
```
The `TarReader` class does not have an `extract` method; as the name suggests, it is a reader. It is the developer's responsibility to implement the extraction. If the programmer writes to the destination by simply appending the extracted filename to the output directory without normalizing the path, it could lead to a path traversal attack.

An example of vulnerable code would be the following:

```rb
def unsafe_untar(file_name, output)
  # bad
  File.open(file_name, 'rb') do |file_stream|
    Gem::Package::TarReader.new(file_stream).each do |entry|
      entry_var = entry.full_name
      path = File.expand_path(entry_var, output)

      File.open(path, 'wb') do |f|
        f.write(entry.read)
      end
    end
  end
end  
```

### [zlib](https://ruby-doc.org/stdlib-2.7.0/libdoc/zlib/rdoc/Zlib.html) + [TarReader](https://docs.ruby-lang.org/en/3.1/Gem/Package/TarReader.html)

```rb
Gem::Package::TarReader.new(Zlib::GzipReader.open(file_name))
```

Extracting `.tar.gz` files requires both `TarReader` and `GzipReader` class. As well as `tar` extraction, the extraction of `.tar.gz` the responsible of making sure that the `destination_directory` is safe is the developer.

An example of vulnerable code would be the following:

```rb
def unsafe_untargz(file_name, output)
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
```

The `unsafe_untargz()` method first uses `Zlib::GzipReader` to decompress the gzip archive and then creates a `TarReader` object to read the TAR contents. For each entry in the TAR file it opens a file using the filename appended to the output path. However, since the method uses directly `entry.full_name` without validating or normalizing the path, it may lead to path traversal.

## Safe Usages

### [zip](https://rubygems.org/gems/zip/)

Since the `extract()` method of `zip` library requires sanitizing the write path or checking if the write path is within the output path, we can take two approaches.

#### Path Sanitization

To sanitize the path, we can normalize it using `File.basename`. This method extracts only the filename from a given path, removing directory components:

```rb
def safe_unzip(file_name, output)
  # good
  Zip::File.open(file_name) do |zip_file|
    zip_file.each do |entry|
      file_path = File.join(output, File.basename(entry.name))
      FileUtils.mkdir_p(File.dirname(file_path))
      zip_file.extract(entry, file_path) 
    end
  end
end
```

#### Path Validation

Alternatively, before writing the content of the entry to the write path, ensure that the write path is within the destination path using `start_with`.

```rb
def safe_unzip(file_name, output)
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
```

#### Importance of `File.expand_path()`

Using `File.expand_path()` is crucial, this method converts a relative file path into an absolute file path, ensuring proper validations:

```rb
# output = Ruby/PoC/test_case

# path = Ruby/PoC/poc.txt
path = File.expand_path(entry_var, output)

# Check for path traversal
unless path.start_with?(File.expand_path(output))
    raise "Attempted Path Traversal Detected: #{entry_var}"
end
```

#### Potential Issue of `File.join()`

If we use `File.join` instead to check the destination path, it may lead to vulnerabilities:

```rb
# output = Ruby/PoC/test_case

# path = Ruby/PoC/test_case/../poc.txt
path = File.join(output, entry_var)

# Incorrect check
unless path.start_with?(File.expand_path(output))
    raise "Attempted Path Traversal Detected: #{entry_var}"
end
```

In this case, the check would be incorrect returning `true`, allowing path traversal.


### [TarReader](https://docs.ruby-lang.org/en/3.1/Gem/Package/TarReader.html)

`Gem::Package::TarReader` class is designed for reading TAR files, allowing developers to access and iterate through the entries within the TAR. Since the class lacks an extraction method, developers are responsible of ensuring that the write path is sanitized and within the output path.


#### Path Sanitization

To sanitize the path, we can normalize it using `File.basename`. This method extracts only the filename from a given path, removing directory components:

```rb
def safe_untar(file_name, output)
  # safe
  file_stream = IO.new(IO.sysopen(file_name))
  tarfile = Gem::Package::TarReader.new(file_stream)
  tarfile.each do |entry|
    entry_var = File.basename(entry.full_name)
    File.open(output+ "/" + entry_var, "wb")  do |f|
      f.write(entry.read)
    end
  end
end  
```

#### Path Validation

Alternatively, before writing the content of the entry to the write path, ensure that the write path is within the destination path using `start_with`.

```rb
def safe_untar(file_name, output)
  # safe
  File.open(file_name, 'rb') do |file_stream|
    Gem::Package::TarReader.new(file_stream).each do |entry|
      entry_var = entry.full_name
      safe_path = File.expand_path(entry_var, output)

      unless safe_path.start_with?(File.expand_path(output))
        raise "Attempted Path Traversal Detected: #{entry_var}"
      end

      File.open(safe_path, 'wb') do |f|
        f.write(entry.read)
      end
    end
  end
end  
```

#### Importance of `File.expand_path()`

Using `File.expand_path()` is crucial, this method converts a relative file path into an absolute file path, ensuring proper validations:

```rb
# output = Ruby/PoC/test_case

# path = Ruby/PoC/poc.txt
path = File.expand_path(entry_var, output)

# Check for path traversal
unless path.start_with?(File.expand_path(output))
    raise "Attempted Path Traversal Detected: #{entry_var}"
end
```

#### Potencial Issue of `File.join()`

If we use `File.join` instead to check the destination path, it may lead to vulnerabilities:

```rb
# output = Ruby/PoC/test_case

# path = Ruby/PoC/test_case/../poc.txt
path = File.join(output, entry_var)

# Incorrect check
unless path.start_with?(File.expand_path(output))
    raise "Attempted Path Traversal Detected: #{entry_var}"
end
```

In this case, the check would be incorrect returning `true`, allowing path traversal.

### [zlib](https://ruby-doc.org/stdlib-2.7.0/libdoc/zlib/rdoc/Zlib.html) + [TarReader](https://docs.ruby-lang.org/en/3.1/Gem/Package/TarReader.html)

The mitigation for `.tar.gz` path traversal is the same as `TarReader`.