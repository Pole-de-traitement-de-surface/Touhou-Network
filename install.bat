@ECHO OFF

setlocal ENABLEEXTENSIONS

@ECHO Detecting Node version installed.
:CHECK_NODE
for /f tokens^=1-1^ delims^=v. %%n in ('node -v 2^>^&1') do set "nver=%%n"
@ECHO CurrentVersion %nver%

if %nver% NEQ 16 GOTO NODE_NOT_INSTALLED

:NODE_INSTALLED

@ECHO NODE 16 found!
@ECHO Installing Touhou Network ...

SET BASE=%~dp0

PUSHD "%BASE%\conf"

cd %BASE%\src
npm install
cd %BASE%

node "%BASE%\src\main.js" --install

if errorlevel 1 (
   @echo Network installation failed!
   POPD
   exit /b %errorlevel%
)
POPD

::"%BASE%"touhou_network.exe install

@ECHO Touhou Network installed successfully!

GOTO END

:NODE_NOT_INSTALLED
@ECHO NODE 16 is not installed. Only NODE 16 is supported
@ECHO Please go to https://nodejs.org/ and install NODE 16. Then retry installation.
PAUSE
GOTO END

:END
pause
