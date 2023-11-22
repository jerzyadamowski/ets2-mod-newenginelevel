### WORK IN PROGRESS - mod isn't fully functional

## Setup develop environment.

Powershell support

With admin privileges run:

```
./src/install.ps1
```

At end you should get functions supported by module `psexcel`

## Modify parameters in NewEngineFormulas.xlsx

## Fill output files with new unlock level

```
./src/update.ps1
```

## Create mod package `NewEngineLevel.scs` and deploys it to `-outDir`

## Before you run package.ps1 make sure that you installed 7zip on your OS

```
.\src\package.ps1 -outDir "c:\Users\<USER DIRECTORY>\Documents\Euro Truck Simulator 2\mod\"
```

MATH for caculate engine level:
FLE (First Level Expected) = 0
LLE (Last Level Expected) = 100
HP (Horse Power) = 360
LHP (Lowest Horse Power for Truck) = 360
HHP (Highest Horse Power for Truck) = 510
M (Muliplier Key Power for HHP) = 4
LTKHP (Lowest Temporary Key Horse Power) = MIN(TKHP)
HTKHP (Higest Temporary Key Horse Power) = MAX(TKHP)

TKHP (Temporary Key Horse Power) = ROUND(HP + LHP + HHP _ M)+ MAX(HP - LHP, 0) _ 2
NL (New Level) = ROUND(((TKHP - LTKHP)/(HTKHP - LTKHP))\*(LLE - FLE)) + FLE
