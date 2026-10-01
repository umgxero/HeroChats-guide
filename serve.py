import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class HeroChatsHTTPHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # Enable CORS and caching headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

    def guess_type(self, path):
        if path.endswith('.apk'):
            return 'application/vnd.android.package-archive'
        elif path.endswith('.js'):
            return 'application/javascript; charset=utf-8'
        elif path.endswith('.css'):
            return 'text/css; charset=utf-8'
        elif path.endswith('.svg'):
            return 'image/svg+xml'
        return super().guess_type(path)

def run():
    port = PORT
    for attempt in range(5):
        try:
            with socketserver.TCPServer(("", port), HeroChatsHTTPHandler) as httpd:
                url = f"http://localhost:{port}"
                print("=" * 60)
                print(f"[HERO CHATS] 3D Promotional Website running at: {url}")
                print(f"[PATH] Serving directory: {DIRECTORY}")
                print(f"[PACKAGE] Direct APK available at: {url}/Hero-Chats.apk")
                print("Press Ctrl+C to stop the local server.")
                print("=" * 60)
                webbrowser.open(url)
                httpd.serve_forever()
                break
        except OSError:
            print(f"Port {port} busy, trying port {port + 1}...")
            port += 1

if __name__ == '__main__':
    run()
