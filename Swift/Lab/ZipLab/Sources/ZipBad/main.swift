import Foundation
import Zip

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

func main() {
    unzipFile()
}

main()
