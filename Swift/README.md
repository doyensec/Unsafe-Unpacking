# Swift Decompression Attack

## Introduction

Archives are file formats like ZIP, RAR or TAR, compressing multiple files into a single file to save storage or data transfer.

Decompression attacks exploit the way systems handle the extraction of the files from the archive. The attack occurs when a archive is crafterd to extract files outside of it's intended directory by exploiting path traversal. This vulnerability may lead to serious security issues, as attacker may arbitrary write data in the system.

## Unsafe Usages

### [Zip](https://github.com/marmelroy/Zip.git)

```swift
Zip.unzipFile()
```

The `unzipFile()` method in Swift's `Zip`  library is used to extract the contents of a ZIP file to a destination. This method is unsafe since it doesn't remove redundant dots and separators from the entry making it vulnerable against path traversal. 

In the official repository, we can see the following code snippet:

```swift
let fullPath = destination.appendingPathComponent(pathString).standardized.path
// .standardized removes any ".. to move a level up".
// If we then check that the fullPath starts with the destination directory we know we are not extracting "outside" te destination.
guard fullPath.starts(with: destination.standardized.path) else {
    throw ZipError.unzipFail
}
```

While the implementation is correct, ensures that the extraction path is inside the intended destination path, so why is it vulnerable? The reason is because also the fix is already merged to the official repository, the fix is not included in the latest release. Since all the swift builds are done from the releases the method is still vulnerable:

```s
    dependencies: [
    .package(url: "https://github.com/marmelroy/Zip.git", from: "2.1.2"),
    ],
```

An example of vulnerable code would be the following:

```swift
func unzipFile() {
    do {
        let filePath = CommandLine.arguments[1]
        let source = URL(fileURLWithPath: filePath)
        let destination = URL(fileURLWithPath: FileManager.default.currentDirectoryPath)
        // Malicious zip is unpacked
        try Zip.unzipFile(source, destination: destination, overwrite: true, password: nil)
        } catch {
    }
}
```

## Safe Usages

### [ZIPFoundation](https://github.com/weichsel/ZIPFoundation)

`FileManager().unzipItem(at:to:)`

Using `unzipItem()` we prevent path traversal since it ensures that the extract path remains within the destination path:

```swift
let path = pathEncoding == nil ? entry.path : entry.path(using: pathEncoding!)
let entryURL = destinationURL.appendingPathComponent(path)
guard entryURL.isContained(in: destinationURL) else {
    throw CocoaError(.fileReadInvalidFileName,
                        userInfo: [NSFilePathErrorKey: entryURL.path])
}
```

An example of safe code would be the following:

```swift
func unzipFile() {
    do {
        let filePath = CommandLine.arguments[1]
        let source = URL(fileURLWithPath: filePath)
        let destination = URL(fileURLWithPath: FileManager.default.currentDirectoryPath)
        let fileManager = FileManager()
        // Malicious zip is unpacked
        try fileManager.unzipItem(at:source, to: destination)
        } catch {
    }
}
```