from invoke import run, task


@task
def watch(ctx):
    ctx.run('webpack --progress --colors -d --watch')


@task
def build():
    ctx.run('webpack --progress --colors --optimize-minimize')
