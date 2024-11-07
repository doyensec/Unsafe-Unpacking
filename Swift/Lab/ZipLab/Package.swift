// swift-tools-version:5.7
import PackageDescription

let package = Package(
    name: "ZipBad",
    platforms: [
    .macOS(.v10_12), // Specify the platform and version
    ],
    products: [
    .executable(name: "ZipBad", targets: ["ZipBad"]),
    ],
    dependencies: [
    .package(url: "https://github.com/marmelroy/Zip.git", from: "latest"),
    ],
    targets: [
    .target(
    name: "ZipBad",
    dependencies: ["Zip"]),
    ]
)