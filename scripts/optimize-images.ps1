Add-Type -AssemblyName System.Drawing

function Optimize-Image {
    param (
        [string]$Path,
        [int]$MaxWidth,
        [int]$MaxHeight
    )

    if (-not (Test-Path $Path)) { return }

    $origFile = Get-Item $Path
    $oldSize = [math]::Round($origFile.Length / 1KB, 2)

    try {
        $img = [System.Drawing.Image]::FromFile($Path)
        
        $width = $img.Width
        $height = $img.Height

        if ($width -gt $MaxWidth -or $height -gt $MaxHeight) {
            $ratioX = $MaxWidth / $width
            $ratioY = $MaxHeight / $height
            $ratio = [Math]::Min($ratioX, $ratioY)

            $newWidth = [int]($width * $ratio)
            $newHeight = [int]($height * $ratio)
        } else {
            $newWidth = $width
            $newHeight = $height
        }

        $bmp = New-Object System.Drawing.Bitmap($newWidth, $newHeight)
        $graph = [System.Drawing.Graphics]::FromImage($bmp)
        $graph.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $graph.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $graph.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $graph.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

        $graph.DrawImage($img, 0, 0, $newWidth, $newHeight)
        $img.Dispose()
        $graph.Dispose()

        # Save to temp file first to overwrite
        $tempPath = $Path + ".tmp.png"
        $bmp.Save($tempPath, [System.Drawing.Imaging.ImageFormat]::Png)
        $bmp.Dispose()

        Move-Item -Path $tempPath -Destination $Path -Force
        $newSize = [math]::Round((Get-Item $Path).Length / 1KB, 2)
        Write-Host "Optimized $Path : ${oldSize}KB -> ${newSize}KB"
    } catch {
        Write-Host "Error processing $Path : $_"
    }
}

# Optimize icon.png
Optimize-Image -Path "C:\Downloads\Antigravity\MyPrayerTower\apps\web\public\icon.png" -MaxWidth 512 -MaxHeight 512
Optimize-Image -Path "C:\Downloads\Antigravity\MyPrayerTower\public\icon.png" -MaxWidth 512 -MaxHeight 512

# Create icon-192.png and icon-512.png
Copy-Item "C:\Downloads\Antigravity\MyPrayerTower\apps\web\public\icon.png" "C:\Downloads\Antigravity\MyPrayerTower\apps\web\public\icon-512.png" -Force
Optimize-Image -Path "C:\Downloads\Antigravity\MyPrayerTower\apps\web\public\icon-192.png" -MaxWidth 192 -MaxHeight 192

# Optimize large background and banner images
$targets = @(
    "apps/web/public/app-dashboard-bg.png",
    "apps/web/public/blog-og-fallback.png",
    "apps/web/public/candle-bg-pattern.png",
    "apps/web/public/images/anniversary_header.png",
    "public/app-dashboard-bg.png",
    "public/blog-og-fallback.png",
    "public/candle-bg-pattern.png",
    "public/images/anniversary_header.png"
)

foreach ($target in $targets) {
    $fullPath = Join-Path "C:\Downloads\Antigravity\MyPrayerTower" $target
    Optimize-Image -Path $fullPath -MaxWidth 1200 -MaxHeight 1200
}

# Also optimize candle images
Get-ChildItem -Path "C:\Downloads\Antigravity\MyPrayerTower\apps\web\public\images\candles" -Filter "*.png" | ForEach-Object {
    Optimize-Image -Path $_.FullName -MaxWidth 400 -MaxHeight 400
}
Get-ChildItem -Path "C:\Downloads\Antigravity\MyPrayerTower\public\images\candles" -Filter "*.png" | ForEach-Object {
    Optimize-Image -Path $_.FullName -MaxWidth 400 -MaxHeight 400
}
