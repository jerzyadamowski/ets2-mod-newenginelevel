import-module psexcel

$modeDirectories = Get-ChildItem -Path .\mode -Directory

foreach ($dir in $modeDirectories) {
  $importData = Import-XLSX -Path "$($dir.FullName)\NewEngineFormulas.xlsx" -RowStart 18;

  $currentTruckPathSource = "";
  $currentTruckPathDest = "";

  foreach ($row in $importData) {
    # get truck path
    if ( [System.String]::IsNullOrWhiteSpace($row."Engine HP")) {
      $currentTruckPathSource = "$((Resolve-Path .\).Path)\src\def\vehicle\truck\$($row."Truck Name")\engine\"
      $currentTruckPathDest = "$((Resolve-Path .\).Path)\out\$($dir.Name)\def\vehicle\truck\$($row."Truck Name")\engine\"
      continue;
    }

    #get engine path
    if ( [System.Int32]::Parse($row."Engine HP") -gt 0) {
      $currentEnginePathSource = "$currentTruckPathSource$($row."Truck Name")"
      $currentEnginePathDest = "$currentTruckPathDest$($row."Truck Name")"
    }

    #if no more record end here
    if ( [System.String]::IsNullOrWhiteSpace($row."Truck Name")) {
      break;
    }

    #read content from file with replace placeholders within new level
    $newContent = (Get-Content -Path $currentEnginePathSource) -replace 'unlock:(.*\d*)', "unlock: $($row."New Lvl")"

    #write content to file
    If (!(test-path $currentTruckPathDest)) {
      New-Item -ItemType Directory -Force -Path $currentTruckPathDest | Out-Null
    }

    [System.IO.File]::WriteAllLines($currentEnginePathDest, $newContent) | Out-Null
  }
}

