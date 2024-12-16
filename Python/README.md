# Python Decompression Attack

## Introduction

There are various libraries used for decompression in Python, some of them are `ziplib`, `tarlib` and `shutil`.

## [ZipLib](https://docs.python.org/3/library/zipfile.html)

### `ZipFile.extract() - SAFE`

```py
method:: ZipFile.extract(member, path=None, pwd=None)
```

The `extract()` method in Python's `zipfile` module is used to extract a member from the archive to the current directory. This method is safe against path traversal since it removes redundant separators and dots:

```py
def _extract_member(self, member, targetpath, pwd):
    """Extract the ZipInfo object 'member' to a physical
        file on the path targetpath.
    """

    # [...]

     # interpret absolute pathname as relative, remove drive letter or
    # UNC path, redundant separators, "." and ".." components.
    arcname = os.path.splitdrive(arcname)[1]
    invalid_path_parts = ('', os.path.curdir, os.path.pardir)
    arcname = os.path.sep.join(x for x in arcname.split(os.path.sep)
                                if x not in invalid_path_parts)
```

It defines a tuple that contains an empty string, current directory (".") and parent directory (".."). The the code spliths the path into its components using `os.path.sep` ("/") then filters out any component present in `invalid_path_parts`. Preventing possible path injections.

```py
def unzip(file_name, output):
    # good
    with zipfile.ZipFile(file_name, 'r') as zf:
        all_files = zf.namelist()
        for file in all_files:
            zf.extract(file, output)
```

### `ZipFile.extractall() - SAFE`

```py
method:: ZipFile.extractall(path=None, members=None, pwd=None)
```

The `extractall()` method is a convenient way to extract all the contents of a ZIP file into a specified directory instead of iterating and extracting files one by one using `extract()`. Since this method is based on the implementation of `extract()` it is also safe against path traversal.

```py
def unzip(file_name, output):
    # good
    with zipfile.ZipFile(file_name, 'r') as zf:
            zf.extractall(output)
```

### `ZipFile + shutil.copyfileobj() - UNSAFE`

When opening a `ZipFile` there are several ways to extract the data not only with the methods included in the library itself. There are lot of developers using `shutil` to extract the contents of the zip with `shutil.copyfileobj()` (actually the builin method uses the same method):

```py
def copyfileobj(fsrc, fdst, length=0):
    """copy data from file-like object fsrc to file-like object fdst"""
    if not length:
        length = COPY_BUFSIZE
    # Localize variable access to minimize overhead.
    fsrc_read = fsrc.read
    fdst_write = fdst.write
    while buf := fsrc_read(length):
        fdst_write(buf)
```

The implementation of the method is straightforward, in the first argument we pass the file descriptor to the file to extract and in the second argument we pass the file descriptor to the destination. Since the method receives file descriptors instead of paths it doesn't know if the path is out of the output directory.

```py
def unzip(file_name, output):
    # bad
    with zipfile.ZipFile(file_name, 'r') as zf:
        for filename in zf.namelist():
            # Output
            output_path = os.path.join(output, filename)
            with zf.open(filename) as source:
                with open(output_path, 'wb') as destination:
                    shutil.copyfileobj(source, destination)
```

The function initializes the `ZipFile` object and then it iterates through all its files (the array contains all the filenames of the zip). Then it sets the `output_path` variable with the output directory and the filename. 

Since `os.path.join` does not normalize it allows references to parent directory like ("..") and filename may contain those "..", the `output_path` may be out of the output directory, leading to path injection.

Then it sets the file descriptor to the file to extract as `source` and the `output_path` as `destination`. Finally the content of `source` is written to `destination`.

The safe way to implement this is to normalize the output path we can use `os.path.normpath()` instead or `os.path.basename(filename)` to prevent path injection:

`os.path.normpath()`:

```py
def unzip(file_name, output):
    # bad
    with zipfile.ZipFile(file_name, 'r') as zf:
        for filename in zf.namelist():
            # Output
            output_path = os.path.normpath(output, filename)
            with zf.open(filename) as source:
                with open(output_path, 'wb') as destination:
                    shutil.copyfileobj(source, destination)
```

`os.path.basename(filename)`:

```py
def unzip(file_name, output):
    # good
    with zipfile.ZipFile(file_name, 'r') as zf:
        filelist = zf.namelist()
        
        for x in filelist:
            output_path = os.path.join(output, os.path.basename(x))
            with zf.open(x) as source_file:
                with open(output_path, 'wb') as target_file:
                    shutil.copyfileobj(source_file, target_file)
```

### `TarFile.extract() - UNSAFE`

The `extract()` method in Python's `tarfile` module is used to extract a member from the archive to the current directory. This method is unsafe against path traversal since it doesn't remove redundant separators and dots:

```py
def _extract_member(self, tarinfo, targetpath, set_attrs=True,
                    numeric_owner=False):
    """Extract the TarInfo object tarinfo to a physical
        file called targetpath.
    """
    # Fetch the TarInfo object for the given name
    # and build the destination pathname, replacing
    # forward slashes to platform specific separators.
    targetpath = targetpath.rstrip("/")
    targetpath = targetpath.replace("/", os.sep)

    # Create all upper directories.
    upperdirs = os.path.dirname(targetpath)
    if upperdirs and not os.path.exists(upperdirs):
        # Create directories that are not part of the archive with
        # default permissions.
        os.makedirs(upperdirs)

    if tarinfo.islnk() or tarinfo.issym():
        self._dbg(1, "%s -> %s" % (tarinfo.name, tarinfo.linkname))
    else:
        self._dbg(1, tarinfo.name)

    if tarinfo.isreg():
        self.makefile(tarinfo, targetpath)
```

`extract()` method calls `makefile()` that writes the content first parameter to the `targetpath` which is the second parameter:

```py
def makefile(self, tarinfo, targetpath):
    """Make a file called targetpath.
    """
    source = self.fileobj
    source.seek(tarinfo.offset_data)
    bufsize = self.copybufsize
    with bltn_open(targetpath, "wb") as target:
        if tarinfo.sparse is not None:
            for offset, size in tarinfo.sparse:
                target.seek(offset)
                copyfileobj(source, target, size, ReadError, bufsize)
            target.seek(tarinfo.size)
            target.truncate()
        else:
            copyfileobj(source, target, tarinfo.size, ReadError, bufsize)
```

`makefile()` uses `copyfileobj()` to transfer the file data which is a method from `shutil` library (previously mentioned).

```py
def untar(file_name, output):
    # bad
    with tarfile.open(file_name, 'r') as tf:
        for member in tf.getmembers():
            tf.extract(member) 
```

### `TarFile.extractall() - UNSAFE`

The `extractall()` method is a convenient way to extract all the contents of a TAR file into a specified directory instead of iterating and extracting files one by one using `extract()`. Since this method is based on the implementation of `extract()` it is also unsafe against path traversal.

```py
def untar(file_name, output):
    # bad
    with tarfile.open(file_name, 'r') as tf:
        tf.extractall(output)
```

### `TarFile + shutil.copyfileobj() - UNSAFE`

When opening `TarFile` there are several ways to extract the data not only with the methods included in the library itself. There are lot of developers using `shutil` to extract the contents of the zip with `shutil.copyfileobj()` (actually the builin method uses the same method):

```py
def copyfileobj(fsrc, fdst, length=0):
    """copy data from file-like object fsrc to file-like object fdst"""
    if not length:
        length = COPY_BUFSIZE
    # Localize variable access to minimize overhead.
    fsrc_read = fsrc.read
    fdst_write = fdst.write
    while buf := fsrc_read(length):
        fdst_write(buf)
```

The implementation of the method is straightforward, in the first argument we pass the file descriptor to the file to extract and in the second argument we pass the file descriptor to the destination. Since the method receives file descriptors instead of paths it doesn't know if the path is out of the output directory.

```py
def untar(file_name, output):
    # bad
    with tarfile.open(file_name, 'r') as tf:
        for member in tf.getmembers():
            output_path = os.path.join(output, member.name)
            with tf.extractfile(member) as source_file:
                with open(output_path, 'wb') as dest_file:
                    shutil.copyfileobj(source_file, dest_file)
```

The function opens the file using `tarfile.open()` and then it iterates through all its files (members, the array contains all the filenames of the zip). Then it sets the `output_path` variable with the output directory and the filename.

Since `os.path.join` does not normalize it allows references to parent directory like ("..") and filename may contain those "..", the `output_path` may be out of the output directory, leading to path injection.

Then it sets the file descriptor to the file to extract as `source` and the `output_path` as `dest_file`. Finally the content of `source` is written to `dest_file`.

The safe way to implement this is to normalize the output path we can use `os.path.normpath()` instead or `os.path.basename(filename)` to prevent path injection:

`os.path.normpath()`:

```py
def untar(file_name, output):
    # bad
    with tarfile.open(file_name, 'r') as tf:
        for member in tf.getmembers():
            output_path = os.path.normpath(output, member.name)
            with tf.extractfile(member) as source_file:
                with open(output_path, 'wb') as dest_file:
                    shutil.copyfileobj(source_file, dest_file)
```

`os.path.basename(filename)`:

```py
def untar(file_name, output):
    # bad
    with tarfile.open(file_name, 'r') as tf:
        for member in tf.getmembers():
            output_path = os.path.join(output, os.path.basename(member.name))
            with tf.extractfile(member) as source_file:
                with open(output_path, 'wb') as dest_file:
                    shutil.copyfileobj(source_file, dest_file)
```

### `shutil.unpack_archive() - UNSAFE`

The `unpack_archive()` method in the `shutil` library can unpack both tar and zip files.

```py
def unpack_archive(filename, extract_dir=None, format=None, *, filter=None):
    """Unpack an archive.

    `filename` is the name of the archive.

    `extract_dir` is the name of the target directory, where the archive
    is unpacked. If not provided, the current working directory is used.

    `format` is the archive format: one of "zip", "tar", "gztar", "bztar",
    or "xztar".  Or any other registered format.  If not provided,
    unpack_archive will use the filename extension and see if an unpacker
    was registered for that extension.

    In case none is found, a ValueError is raised.

    If `filter` is given, it is passed to the underlying
    extraction function.
    """
    sys.audit("shutil.unpack_archive", filename, extract_dir, format)

    if extract_dir is None:
        extract_dir = os.getcwd()

    extract_dir = os.fspath(extract_dir)
    filename = os.fspath(filename)

    if filter is None:
        filter_kwargs = {}
    else:
        filter_kwargs = {'filter': filter}
    if format is not None:
        try:
            format_info = _UNPACK_FORMATS[format]
        except KeyError:
            raise ValueError("Unknown unpack format '{0}'".format(format)) from None

        func = format_info[1]
        func(filename, extract_dir, **dict(format_info[2]), **filter_kwargs)
    else:
        # we need to look at the registered unpackers supported extensions
        format = _find_unpack_format(filename)
        if format is None:
            raise ReadError("Unknown archive format '{0}'".format(filename))

        func = _UNPACK_FORMATS[format][1]
        kwargs = dict(_UNPACK_FORMATS[format][2]) | filter_kwargs
        func(filename, extract_dir, **kwargs)
```

The method first tries to identify the format to unpack, which is defined in `_UNPACK_FORMATS`:

```py
_UNPACK_FORMATS = {
    'tar':   (['.tar'], _unpack_tarfile, [], "uncompressed tar file"),
    'zip':   (['.zip'], _unpack_zipfile, [], "ZIP file"),
}
```

Then the function to run is `func = _UNPACK_FORMATS[format][1]` which in the case of zip is `_unpack_zipfile()` and in the case of tar is `_unpack_tarfile()`. 

`_unpack_zipfile()`:

```py
def _unpack_zipfile(filename, extract_dir):
    """Unpack zip `filename` to `extract_dir`
    """
    import zipfile  # late import for breaking circular dependency
    # ...
    zip = zipfile.ZipFile(filename)
    try:
        for info in zip.infolist():
            name = info.filename

            # don't extract absolute paths or ones with .. in them
            if name.startswith('/') or '..' in name:
                continue

            # ...
                with zip.open(name, 'r') as source, \
                        open(targetpath, 'wb') as target:
                    copyfileobj(source, target)
    finally:
        zip.close()
```

There is a check if the name contains references to the parent directory so it is safe against path injection (at least for zip).

`_unpack_tarfile()`:

```py
def _unpack_tarfile(filename, extract_dir, *, filter=None):
    """Unpack tar/tar.gz/tar.bz2/tar.xz `filename` to `extract_dir`
    """
    import tarfile  # late import for breaking circular dependency
    try:
        tarobj = tarfile.open(filename)
    # ...
    try:
        tarobj.extractall(extract_dir, filter=filter)
    finally:
        tarobj.close()
```

The function calls `extractall()`, as we mentioned `extractall()` method is vulnerable against path injection and consequently `unpack_archive()` is too.

```py
def unpack_zip(file_name, output_dir):
    # good
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    shutil.unpack_archive(file_name, extract_dir=output_dir, format='zip')

def unpack_tar(file_name, output_dir):
    # bad
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    shutil.unpack_archive(file_name, extract_dir=output_dir, format='tar')
```