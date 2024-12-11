def soultion(M,D,R):
    if(R>D):  
        return "NO"
    if(R<=D and R<=M+(D-R)):
        return "YES"
    else:
        return "NO"