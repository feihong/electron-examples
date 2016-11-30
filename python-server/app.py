import subprocess

from flask import Flask, request, render_template


app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html', port=app.port)


@app.route('/shutdown/')
def shutdown():
    print('Server shutting down...')
    shutdown_server()
    return 'ok'


def get_unused_port():
    import socket
    s = socket.socket()
    s.bind(('', 0))
    result = s.getsockname()[1]
    s.close()
    return result


def shutdown_server():
    func = request.environ.get('werkzeug.server.shutdown')
    if func is None:
        raise RuntimeError('Not running with the Werkzeug Server')
    func()


if __name__ == '__main__':
    port = get_unused_port()
    proc = subprocess.Popen(['electron', 'main.js', str(port)])
    app.port = port
    app.run(port=port)
