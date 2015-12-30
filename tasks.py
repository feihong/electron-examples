from invoke import run, task


@task
def watch():
    run('webpack --progress --colors -d --watch')

@task
def build():
    run('webpack --progress --colors --optimize-minimize')
