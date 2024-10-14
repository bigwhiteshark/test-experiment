import argparse

def cli():
  parser = argparse.ArgumentParser(description='CLI描述')
  subparsers = parser.add_subparsers(metavar='子命令')

  one_parser = subparsers.add_parser('one', help='第一个命令')
  one_parser.set_defaults(handle=handle_one)

  args = parser.parse_args()
  if hasattr(args, 'handle'):
    args.handle(args)
  else:
    parser.print_help()



def handle_one(args):
    print('one')

if __name__ == '__main__':
    cli()