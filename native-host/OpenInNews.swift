import AppKit
import Foundation

// Chrome native messaging protocol: 4-byte length prefix (little-endian) + JSON
func readMessage() -> [String: Any]? {
    let stdin = FileHandle.standardInput
    let lengthData = stdin.readData(ofLength: 4)
    guard lengthData.count == 4 else { return nil }
    let length = lengthData.withUnsafeBytes { $0.load(as: UInt32.self) }
    let messageData = stdin.readData(ofLength: Int(length))
    return try? JSONSerialization.jsonObject(with: messageData) as? [String: Any]
}

func sendMessage(_ message: [String: Any]) {
    guard let data = try? JSONSerialization.data(withJSONObject: message) else { return }
    var length = UInt32(data.count)
    let lengthData = Data(bytes: &length, count: 4)
    FileHandle.standardOutput.write(lengthData)
    FileHandle.standardOutput.write(data)
}

guard let message = readMessage(),
      let urlString = message["url"] as? String,
      let url = URL(string: urlString) else {
    sendMessage(["success": false, "error": "Invalid or missing URL"])
    exit(1)
}

let services = NSSharingService.sharingServices(forItems: [url])
guard let newsService = services.first(where: { $0.title == "Open in News" }) else {
    sendMessage(["success": false, "error": "Open in News service not available"])
    exit(1)
}

newsService.perform(withItems: [url])
sendMessage(["success": true])

// Give the service time to launch News
RunLoop.current.run(until: Date(timeIntervalSinceNow: 2))
