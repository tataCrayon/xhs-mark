$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$dir = "F:\Projects\chromeProjects\xsh-mark\prototype\assets"
$out = "$dir\img"
New-Item -ItemType Directory -Force -Path $out | Out-Null

function Resize([string]$src, [int]$w, [int]$h, [bool]$cropSquare) {
  $img = [System.Drawing.Image]::FromFile($src)
  try {
    $bmp = New-Object System.Drawing.Bitmap($w, $h)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    try {
      $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
      $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
      $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
      $srcRect = New-Object System.Drawing.Rectangle(0, 0, $img.Width, $img.Height)
      if ($cropSquare) {
        $side = [Math]::Min($img.Width, $img.Height)
        $srcRect = New-Object System.Drawing.Rectangle([int](($img.Width - $side) / 2), [int](($img.Height - $side) / 2), $side, $side)
      }
      $dstRect = New-Object System.Drawing.Rectangle(0, 0, $w, $h)
      $g.DrawImage($img, $dstRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
    } finally { $g.Dispose() }
    return $bmp
  } finally { $img.Dispose() }
}

$avatars = @('avatar-huapu', 'avatar-baiyu', 'avatar-jing-shi')
$notes   = @('note-lanjing', 'note-suyin', 'note-baiyu', 'note-yuan', 'note-chanhua', 'note-jingji', 'note-xiaofei')

foreach ($a in $avatars) {
  $src = Join-Path $dir "$a.jpg"
  if (-not (Test-Path $src)) { Write-Output "MISS $a"; continue }
  $bmp = Resize $src 180 180 $true
  try { $bmp.Save("$out\$a.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg); Write-Output "OK $a 180x180 $((Get-Item "$out\$a.jpg").Length) bytes" } finally { $bmp.Dispose() }
}
foreach ($n in $notes) {
  $src = Join-Path $dir "$n.jpg"
  if (-not (Test-Path $src)) { Write-Output "MISS $n"; continue }
  $bmp = Resize $src 480 640 $false
  try { $bmp.Save("$out\$n.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg); Write-Output "OK $n 480x640 $((Get-Item "$out\$n.jpg").Length) bytes" } finally { $bmp.Dispose() }
}
