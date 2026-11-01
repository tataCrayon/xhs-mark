param([hashtable]$Map)
$ErrorActionPreference = 'Continue'
$dir = "F:\Projects\chromeProjects\xsh-mark\prototype\assets"
Set-Location $dir
foreach ($name in $Map.Keys) {
  $raw = & mcode-tools get_asset_url $Map[$name] 2>&1 | Out-String
  $m = [regex]::Match($raw, '\{[^{}]*"download_url"[^{}]*\}')
  if (-not $m.Success) { Write-Output "FAIL url $name : $raw"; continue }
  $url = ([regex]::Match($m.Value, '"download_url"\s*:\s*"([^"]+)"')).Groups[1].Value
  $out = Join-Path $dir ($name + ".jpg")
  try {
    Invoke-WebRequest -Uri $url -OutFile $out -UseBasicParsing
    Write-Output ("OK {0} -> {1} bytes" -f $name, (Get-Item $out).Length)
  } catch {
    Write-Output "FAIL dl $name : $($_.Exception.Message)"
  }
}
