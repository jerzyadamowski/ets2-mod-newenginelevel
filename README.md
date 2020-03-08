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