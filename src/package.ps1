#todo: create scs file from this project
param (
  [Parameter(Mandatory=$true)][string]$outDir
)

$inputDir = "$((Resolve-Path .\).Path)"
$fileOutZip = Join-Path -Path $outDir -ChildPath NewEngineLevel.zip
$fileOutScs = Join-Path -Path $outDir -ChildPath NewEngineLevel.scs

$compress = @{
  Path =  "$inputDir\manifest.sii",
          "$inputDir\mod_description.txt",
          "$inputDir\newenginelevel.jpg",
          "$inputDir\def"

  CompressionLevel = "NoCompression"
  DestinationPath = $fileOutZip
}

If((test-path $fileOutZip)) {
  Remove-Item -Path $fileOutZip -Force
}

If((test-path $fileOutScs)) {
  Remove-Item -Path $fileOutScs -Force
}

Compress-Archive @compress

Rename-Item -Path $fileOutZip -NewName $fileOutScs