#todo: create scs file from this project
param (
  [Parameter(Mandatory = $true)][string]$outDir,
  [Parameter(Mandatory = $false)][string]$workshopDir = "$outDir\workshop"
)

function 7zip([String] $aDirectory, [String] $aZipfile) {
  [string]$pathToZipExe = "$($Env:ProgramFiles)\7-Zip\7z.exe";
  & "$pathToZipExe" a -tzip "$aZipfile" "$aDirectory" -r -mx=0
}

If (!(test-path .\out)) {
  New-Item -ItemType Directory -Force -Path .\out | Out-Null
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

  Copy-Item -Path "$($inputDir)\def" -Destination $dirOut -Recurse
  If ((test-path "$((Resolve-Path .\).Path)\mode\$($out.Name)\default\def")) {
    Copy-Item -Path "$((Resolve-Path .\).Path)\mode\$($out.Name)\default\def" -Destination $dirOut -Recurse -Force
  }
  Copy-Item -Path "$((Resolve-Path .\).Path)\mode\$($out.Name)\manifest.sii" -Destination $dirOut
  Copy-Item -Path "$((Resolve-Path .\).Path)\mode\$($out.Name)\mod_description.txt" -Destination $dirOut
  Copy-Item -Path "$((Resolve-Path .\).Path)\mode\$($out.Name)\image.jpg" -Destination $dirOut

  7zip -aDirectory "$dirOut\*" -aZipfile $fileOutZip | Out-Null

  $renameToScs = Split-Path $fileOutScs -Leaf 

  Rename-Item -Path $fileOutZip -NewName $renameToScs

  #todo create export for steam workshop

  If (!(test-path "$workshopDir\$($out.Name)")) {
    New-Item -ItemType Directory -Force -Path "$workshopDir\$($out.Name)" | Out-Null
  }
  else {
    Remove-Item -Path "$workshopDir\$($out.Name)" -Force -Recurse
    New-Item -ItemType Directory -Force -Path "$workshopDir\$($out.Name)" | Out-Null
  }

  Copy-Item -Path "$((Resolve-Path .\).Path)\mode\$($out.Name)\workshop\*" -Destination "$workshopDir\$($out.Name)"  -Recurse -Force
  Copy-Item -Path "$dirOut\*" -Destination "$workshopDir\$($out.Name)\default\" -Force
  Copy-Item -Path "$dirOut\def" -Destination "$workshopDir\$($out.Name)\default\def" -Recurse -Force

  If ((test-path $dirOut)) {
    Remove-Item -Path $dirOut -Force -Recurse
  }
}

