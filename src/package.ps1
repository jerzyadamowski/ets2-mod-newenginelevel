#todo: create scs file from this project
param (
  [Parameter(Mandatory = $true)][string]$outDir
)

function 7zip([String] $aDirectory, [String] $aZipfile) {
  [string]$pathToZipExe = "$($Env:ProgramFiles)\7-Zip\7z.exe";
  & "$pathToZipExe" a -tzip "$aZipfile" "$aDirectory" -r -mx=0
}

$outDirectories = Get-ChildItem -Path .\out -Directory

foreach ($out in $outDirectories) {
  $inputDir = $out.FullName
  $dirOut = Join-Path -Path $outDir -ChildPath $out.Name
  $fileOutZip = Join-Path -Path $outDir -ChildPath "$($out.Name).zip"
  $fileOutScs = Join-Path -Path $outDir -ChildPath "$($out.Name).scs"

  If (!(test-path $dirOut)) {
    New-Item -ItemType Directory -Force -Path $dirOut | Out-Null
  }
  else {
    Remove-Item -Path $dirOut -Force -Recurse
    New-Item -ItemType Directory -Force -Path $dirOut | Out-Null
  }

  If ((test-path $fileOutZip)) {
    Remove-Item -Path $fileOutZip -Force
  }

  If ((test-path $fileOutScs)) {
    Remove-Item -Path $fileOutScs -Force
  }

  Copy-Item -Path "$inputDir\def" -Destination $dirOut -Recurse
  Copy-Item -Path "$((Resolve-Path .\).Path)\mode\$($out.Name)\manifest.sii" -Destination $dirOut
  Copy-Item -Path "$((Resolve-Path .\).Path)\mode\$($out.Name)\mod_description.txt" -Destination $dirOut
  Copy-Item -Path "$((Resolve-Path .\).Path)\mode\$($out.Name)\newenginelevel.jpg" -Destination $dirOut

  7zip -aDirectory "$dirOut\*" -aZipfile $fileOutZip

  Rename-Item -Path $fileOutZip -NewName $fileOutScs
}

