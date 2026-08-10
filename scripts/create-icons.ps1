Add-Type -AssemblyName System.Drawing

function Create-SizedIcon($srcPath, $dstPath, $size) {
    $img = [System.Drawing.Image]::FromFile($srcPath)
    $bmp = New-Object System.Drawing.Bitmap($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.DrawImage($img, 0, 0, $size, $size)
    $img.Dispose()
    $g.Dispose()

    if (Test-Path $dstPath) { Remove-Item $dstPath -Force }
    $bmp.Save($dstPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    
    $fileSize = [math]::Round((Get-Item $dstPath).Length / 1KB, 2)
    Write-Host "Created $dstPath (${size}x${size}) : ${fileSize}KB"
}

$src = "C:\Downloads\Antigravity\MyPrayerTower\apps\web\public\icon.png"

Create-SizedIcon $src "C:\Downloads\Antigravity\MyPrayerTower\apps\web\public\icon-192.png" 192
Create-SizedIcon $src "C:\Downloads\Antigravity\MyPrayerTower\apps\web\public\icon-512.png" 512

Copy-Item "C:\Downloads\Antigravity\MyPrayerTower\apps\web\public\icon-192.png" "C:\Downloads\Antigravity\MyPrayerTower\public\icon-192.png" -Force
Copy-Item "C:\Downloads\Antigravity\MyPrayerTower\apps\web\public\icon-512.png" "C:\Downloads\Antigravity\MyPrayerTower\public\icon-512.png" -Force
