import sys
import subprocess
from flask import Flask, request, render_template


app = Flask(__name__)


@app.route('/')
def index():
    # return 'Not found', 404
    # return 'Massive fail', 500
    # return 1/0
    return render_template('index.html', port=app.port)


@app.route('/random-text/')
def random_number():
    import random
    hanzi = chr(random.randint(0x4e00, 0x9fff))
    num = random.randint(1, 5000)
    return '{} {:4d}'.format(hanzi, num)


if __name__ == '__main__':
    app.port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    # Simulate the case where the server may need to do a lot of initialization
    # before starting up.
    import time; time.sleep(1)
    app.run(port=app.port)
