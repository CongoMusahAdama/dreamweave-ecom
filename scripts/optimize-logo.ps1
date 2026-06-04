Add-Type -AssemblyName System.Drawing
$src = Join-Path $PSScriptRoot '..\public\brand\harv-dreams-logo.png'
$dir = Join-Path $PSScriptRoot '..\public\brand'
$img = [System.Drawing.Image]::FromFile($src)

function Save-Resized($outName, $targetH) {
  $outPath = Join-Path $dir $outName
  $ratio = $targetH / $img.Height
  $w = [int]($img.Width * $ratio)
  $bmp = New-Object System.Drawing.Bitmap $w, $targetH
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
  $g.Clear([System.Drawing.Color]::White)
  $g.DrawImage($img, 0, 0, $w, $targetH)
  $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose()
  $bmp.Dispose()
  Write-Host "Saved $outName (${w}x${targetH})"
}

Save-Resized 'harv-dreams-logo-nav.png' 112
Save-Resized 'harv-dreams-logo-nav@2x.png' 224
$img.Dispose()
