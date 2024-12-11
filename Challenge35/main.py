import sys
def access_file(n,filenames):
    for file in filenames:
        print("===>",file,"<===")
        fp = open(file)
        line=fp.readline()
        i = 1
        while line and i<=n:
            print(line,end="")
            line = fp.readline()
            i = i+1
        print("\n")
        fp.close()

n=10
filenames = []
c=1
sys.argv.pop(0)

for args in sys.argv:
    if(args[0]=="-" and args[1]=="n"):
        n = int(args[2:])
    elif(args[0]=="-" and args[1]=="c"):
        c = int(args[2:])
    else:
        filenames.append(args)


if(filenames == []):
    i = 0
    while(i<n):
        line = input()
        print(line)
        i = i+1
elif(c>1):
    for file in filenames:
        print("===>",file,"<===")
        fp = open(file)
        print(fp.read(c),end="")
        fp.close()
        print("\n")
else:
    access_file(n,filenames)    
        
    
