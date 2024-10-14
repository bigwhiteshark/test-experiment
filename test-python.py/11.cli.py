#%%
import click
import functools

@click.group(help="chatchat 命令行工具")
def main():
    pass
@main.command("init", help="项目初始化")
@click.option('--count',prompt='How many times?',help='Number of greetings.')
@click.option('--name', prompt='Your name',help='The person to greet.')
  
def init(count, name):
    """Simple program that greets NAME for a total of COUNT times."""
    for x in range(int(count)):
        click.echo('Hello %s!' % name)

if __name__ == '__main__':
    main()
